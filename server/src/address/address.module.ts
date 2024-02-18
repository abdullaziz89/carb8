import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { PrismaService } from "../prisma/prisma.service";
import { RoleService } from "../role/role.service";
import { RolesGuard } from "../guards/roles-guard.guard";
import { JwtService } from "@nestjs/jwt";

@Module({
  controllers: [AddressController],
  providers: [AddressService, PrismaService, RoleService, JwtService]
})
export class AddressModule {}
