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
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';

@UseGuards(JwtGuard)
@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Get()
  async findAll() {
    return await this.wishlistsService.findAll();
  }

  @Post()
  async create(
    @Request() { user },
    @Body() createWishlistDto: CreateWishlistDto,
  ) {
    return await this.wishlistsService.create(user.id, createWishlistDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.wishlistsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    return await this.wishlistsService.update(id, updateWishlistDto);
  }

  @Delete(':id')
  async removeOne(@Param('id') id: number) {
    return await this.wishlistsService.removeOne(id);
  }
}
