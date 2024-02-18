import { Module } from "@nestjs/common";
import { HeaderImageController } from "./header-image.controller";
import { HeaderImageService } from "./header-image.service";
import { JwtService } from "@nestjs/jwt";
import { RoleService } from "../role/role.service";
import { RolesGuard } from "../guards/roles-guard.guard";
import { PrismaService } from "../prisma/prisma.service";
import { FileService } from "../file/file.service";

@Module({
  controllers: [HeaderImageController],
  providers: [HeaderImageService, JwtService, RoleService, RolesGuard, PrismaService, FileService]
})
export class HeaderImageModule {
}
