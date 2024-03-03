import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import {JwtService} from "@nestjs/jwt";
import {RoleService} from "../../role/role.service";
import {PrismaService} from "../../prisma/prisma.service";

@Module({
  controllers: [CustomerController],
  providers: [CustomerService, PrismaService, JwtService, RoleService],
  exports: [CustomerService]
})
export class CustomerModule {}
