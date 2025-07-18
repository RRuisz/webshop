import {Body, Controller, Post, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import {AuthGuard} from "@nestjs/passport";
import {JwtGuard} from "./jwt.guard";
import {JwtService} from "@nestjs/jwt";
import {UserService} from "../user/user.service";
import {UserCreateDto} from "../user/dto";
import {AuthLoginDto} from "./dto";


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly jwtService: JwtService, private readonly userService: UserService) {}

  @Post('/register')
  async register(@Body() userDto: UserCreateDto) {
      return this.userService.createUser(userDto);
  }

  @Post('/login')
  async login(@Body() authDto: AuthLoginDto) {
    return this.userService.loginUser(authDto);
  }


}
