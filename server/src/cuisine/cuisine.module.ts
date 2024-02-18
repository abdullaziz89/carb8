import { Module } from '@nestjs/common';
import { CuisineService } from './cuisine.service';
import { CuisineController } from './cuisine.controller';
import { PrismaService } from "../prisma/prisma.service";
import { RoleService } from "../role/role.service";
import { JwtService } from "@nestjs/jwt";
import { FileModule } from "../file/file.module";
import { FileService } from "../file/file.service";

@Module({
  controllers: [CuisineController],
  providers: [CuisineService, PrismaService, RoleService, JwtService, FileService]
})
export class CuisineModule {}
