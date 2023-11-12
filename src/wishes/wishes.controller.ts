import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';

@UseGuards(JwtGuard)
@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  async create(@Request() { user }, @Body() createWishDto: CreateWishDto) {
    return await this.wishesService.create(user, createWishDto);
  }

  @Get('last')
  async findLast() {
    return await this.wishesService.findLast();
  }

  @Get('top')
  async findTop() {
    return await this.wishesService.findTop();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.wishesService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateWishDto: UpdateWishDto) {
    return await this.wishesService.update(id, updateWishDto);
  }

  @Delete(':id')
  async removeOne(@Request() { user }, @Param('id') wishId: number) {
    return await this.wishesService.removeOne(user.id, wishId);
  }

  @Post(':id/copy')
  async copyWish(@Request() { user }, @Param('id') wishId: number) {
    return await this.wishesService.copyWish(user, wishId);
  }
}
