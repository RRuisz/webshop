import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {JwtService} from "@nestjs/jwt";
import {UserService} from "../user/user.service";
import {PrismaService} from "../prisma/prisma.service";
import {ConfigService} from "@nestjs/config";

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtService, UserService, PrismaService, ConfigService],
})
export class AuthModule {}
