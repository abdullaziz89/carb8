import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service';
import { jwtConstants } from '../constants';
import { LocalStrategy } from '../strategies/local.strategy';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { PassportModule } from "@nestjs/passport";
import { AuthController } from './auth.controller';
import { RoleService } from "../role/role.service";
import { PrismaService } from "../prisma/prisma.service";
import {GoogleStrategy} from "../strategies/google.strategy";

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: {expiresIn: '60m'}
    }),
  ],
  providers: [AuthService, RoleService, PrismaService, LocalStrategy, JwtStrategy, GoogleStrategy],
  exports: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
