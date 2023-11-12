import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';
import { WishesService } from '../wishes/wishes.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    private wishesService: WishesService,
  ) {}

  async findAll() {
    return await this.wishlistRepository.find({
      relations: ['owner', 'items'],
    });
  }

  async create(user: User, createWishlistDto: CreateWishlistDto) {
    const { itemsId, ...rest } = createWishlistDto;
    const wishes = await this.wishesService.getWishesByIds(itemsId);
    return await this.wishlistRepository.save({
      ...rest,
      items: wishes,
      owner: user,
    });
  }

  async findOne(id: number) {
    return await this.wishlistRepository.findOne({
      where: { id },
      relations: ['owner', 'items'],
    });
  }

  async update(id: number, updateWishlistDto: UpdateWishlistDto) {
    const { itemsId, ...rest } = updateWishlistDto;
    const wishes = await this.wishesService.getWishesByIds(itemsId);
    return await this.wishlistRepository.update(id, {
      items: wishes,
      ...rest,
    });
  }

  async removeOne(id: number) {
    return await this.wishlistRepository.delete(id);
  }
}
