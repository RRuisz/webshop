import {Body, Controller, Param, Patch, Post, UseGuards} from '@nestjs/common';
import {UserService} from './user.service';
import {UserCreateDto, UserUpdateDto} from "./dto";
import {JwtGuard} from "../auth/jwt.guard";

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() userDto: UserCreateDto) {
    return await this.userService.createUser(userDto);
  }

  @UseGuards(JwtGuard)
  @Patch('update/:id')
  async updateUser(@Body() data: UserUpdateDto, @Param() id: number) {
      const user = await this.userService.updateUser(data, id);
  }
}
