import { Module } from "@nestjs/common";
import { InformationController } from "./information.controller";
import { InformationService } from "./information.service";
import { PrismaService } from "../../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { RoleService } from "../../role/role.service";

@Module({
  controllers: [InformationController],
  providers: [InformationService, PrismaService, JwtService, RoleService]
})
export class InformationModule {
}
