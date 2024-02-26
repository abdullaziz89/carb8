import { Module } from '@nestjs/common';
import { DeviceService } from './device.service';
import {PrismaService} from "../prisma/prisma.service";
import { DeviceController } from './device.controller';

@Module({
  providers: [DeviceService, PrismaService],
  controllers: [DeviceController]
})
export class DeviceModule {}
