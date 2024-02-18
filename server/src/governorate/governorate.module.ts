import { Module } from '@nestjs/common';
import { GovernorateService } from './governorate.service';
import { GovernorateController } from './governorate.controller';
import { PrismaService } from "../prisma/prisma.service";
import { RoleService } from "../role/role.service";
import { JwtService } from "@nestjs/jwt";

@Module({
  controllers: [GovernorateController],
  providers: [GovernorateService, PrismaService, RoleService, JwtService]
})
export class GovernorateModule {}
