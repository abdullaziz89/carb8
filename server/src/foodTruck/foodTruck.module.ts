import { Module } from '@nestjs/common';
import { FoodTruckService } from './foodTruck.service';
import { FoodTruckController } from './foodTruck.controller';
import { PrismaService } from "../prisma/prisma.service";
import { RoleService } from "../role/role.service";
import { JwtService } from "@nestjs/jwt";
import { FileService } from "../file/file.service";
import { InformationModule } from "./information/information.module";
import {MailService} from "../mail/mail.service";

@Module({
  controllers: [FoodTruckController],
  providers: [FoodTruckService, PrismaService, RoleService, JwtService, FileService, MailService],
  imports: [InformationModule],
})
export class FoodTruckModule {}
