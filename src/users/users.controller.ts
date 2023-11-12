import {
  Controller,
  Get,
  Post,
  Param,
  Patch,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { FindUserDto } from './dto/find-user.dto';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getCurrentUser(@Request() { user: { id } }) {
    return await this.usersService.findById(id);
  }

  @Patch('me')
  async update(
    @Request() { user: { id } },
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.update(id, updateUserDto);
  }

  @Get('me/wishes')
  async getUserWishes(@Request() { user: { id } }) {
    return await this.usersService.getUserWishes(id);
  }

  @Get(':username')
  async getUserByUsername(@Param('username') username: string) {
    return await this.usersService.getUserByUsername(username);
  }

  @Get(':username/wishes')
  async getWishesByUsername(@Param('username') username: string) {
    return await this.usersService.getWishesByUsername(username);
  }

  @Post('find')
  async getUserByQuery(@Body() { query }: FindUserDto) {
    return await this.usersService.getUserByQuery(query);
  }
}
