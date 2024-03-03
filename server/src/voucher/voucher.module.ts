import { Module } from '@nestjs/common';
import { VoucherController } from './voucher.controller';
import { VoucherService } from './voucher.service';
import {PrismaService} from "../prisma/prisma.service";
import {UserService} from "../user/user.service";
import {RoleService} from "../role/role.service";
import {JwtModule, JwtService} from "@nestjs/jwt";
import {jwtConstants} from "../constants";

@Module({
  controllers: [VoucherController],
  providers: [VoucherService, PrismaService, UserService, RoleService, JwtService],
  exports: [VoucherService]
})
export class VoucherModule {}
