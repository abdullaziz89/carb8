import { Module } from '@nestjs/common';
import { PaymentStatusController } from './payment-status.controller';
import {PrismaService} from "../../prisma/prisma.service";
import {RoleService} from "../../role/role.service";
import {JwtService} from "@nestjs/jwt";
import {PaymentStatusService} from "./payment-status.service";

@Module({
  controllers: [PaymentStatusController],
  providers: [PaymentStatusService, PrismaService, RoleService, JwtService],
  exports: [PaymentStatusService]
})
export class PaymentStatusModule {}
