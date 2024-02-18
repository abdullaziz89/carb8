import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { PrismaService } from "../prisma/prisma.service";
import {JwtModule} from "@nestjs/jwt";
import { jwtConstants } from "../constants";

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: {expiresIn: '60m'}
    }),
  ],
  controllers: [RoleController],
  providers: [RoleService, PrismaService]
})
export class RoleModule {}
