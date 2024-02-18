import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from "../prisma/prisma.service";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "../constants";
import { RoleService } from "../role/role.service";

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: {expiresIn: '60m'}
    }),
  ],
  providers: [UserService, PrismaService, RoleService],
  exports: [UserService],
  controllers: [UserController]
})
export class UserModule {}
