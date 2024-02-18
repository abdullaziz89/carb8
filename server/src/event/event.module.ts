import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import {PrismaService} from "../prisma/prisma.service";
import {JwtService} from "@nestjs/jwt";
import {RoleService} from "../role/role.service";
import {RolesGuard} from "../guards/roles-guard.guard";

@Module({
  controllers: [EventController],
  providers: [EventService, PrismaService, JwtService, RoleService, RolesGuard]
})
export class EventModule {}
