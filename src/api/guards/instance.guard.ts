import { InstanceDto } from '@api/dto/instance.dto';
import { cache, prismaRepository, waMonitor } from '@api/server.module';
import { CacheConf, configService } from '@config/env.config';
import { Logger } from '@config/logger.config';
import { BadRequestException, ForbiddenException, InternalServerErrorException, NotFoundException } from '@exceptions';
import { NextFunction, Request, Response } from 'express';

const logger = new Logger('InstanceGuard');

async function getInstance(instanceName: string) {
  try {
    const cacheConf = configService.get<CacheConf>('CACHE');

    const exists = !!waMonitor.waInstances[instanceName];

    if (cacheConf.REDIS.ENABLED && cacheConf.REDIS.SAVE_INSTANCES) {
      const keyExists = await cache.has(instanceName);

      return exists || keyExists;
    }

    return exists || (await prismaRepository.instance.findMany({ where: { name: instanceName } })).length > 0;
  } catch (error) {
    throw new InternalServerErrorException(error?.toString());
  }
}

export async function instanceExistsGuard(req: Request, _: Response, next: NextFunction) {
  if (req.originalUrl.includes('/instance/create') || req.originalUrl.includes('/instance/fetchInstances')) {
    return next();
  }

  const param = req.params as unknown as InstanceDto;
  if (!param?.instanceName) {
    throw new BadRequestException('"instanceName" not provided.');
  }

  if (!(await getInstance(param.instanceName))) {
    throw new NotFoundException(`The "${param.instanceName}" instance does not exist`);
  }

  next();
}

export async function instanceLoggedGuard(req: Request, _: Response, next: NextFunction) {
  if (req.originalUrl.includes('/instance/create')) {
    const instance = req.body as InstanceDto;
    const existsInMemory = !!waMonitor.waInstances[instance.instanceName];
    const existsAnywhere = await getInstance(instance.instanceName);

    if (existsAnywhere) {
      // Instance exists in DB — check if it's actually alive and connected
      if (existsInMemory) {
        const status = waMonitor.waInstances[instance.instanceName]?.connectionStatus;
        const state = typeof status === 'string' ? status : status?.state;

        if (state === 'open' || state === 'connecting') {
          // Truly active instance — block creation
          throw new ForbiddenException(`This name "${instance.instanceName}" is already in use.`);
        }
      }

      // Instance exists in DB but is NOT actively connected (stale after cold start)
      // Clean up the stale instance so the user can re-create and reconnect
      logger.info(
        `Instance "${instance.instanceName}" found in database but not actively connected. ` +
          `Cleaning up stale record to allow re-creation (Render cold start recovery).`,
      );

      try {
        // Remove from memory if partially loaded
        if (waMonitor.waInstances[instance.instanceName]) {
          delete waMonitor.waInstances[instance.instanceName];
        }

        // Delete the stale DB record so createInstance can insert fresh
        await prismaRepository.instance.deleteMany({ where: { name: instance.instanceName } });
        logger.info(`Cleaned up stale instance "${instance.instanceName}" from database`);
      } catch (cleanupError) {
        logger.error(`Failed to clean up stale instance: ${cleanupError?.message}`);
        throw new ForbiddenException(
          `This name "${instance.instanceName}" is already in use and cleanup failed. ` +
            `Try deleting it first via DELETE /instance/delete/${instance.instanceName}.`,
        );
      }
    }

    // Final cleanup of any leftover in-memory reference
    if (waMonitor.waInstances[instance.instanceName]) {
      delete waMonitor.waInstances[instance.instanceName];
    }
  }

  next();
}
