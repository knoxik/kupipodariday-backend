import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';
import { WishesService } from '../wishes/wishes.service';
import { User } from '../users/entities/user.entity';
import { UpdateWishDto } from 'src/wishes/dto/update-wish.dto';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    private readonly wishesService: WishesService,
    private readonly dataSource: DataSource,
  ) {}

  async create(user: User, createOfferDto: CreateOfferDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const wish = await this.wishesService.findOne(createOfferDto.itemId);
      if (user.id === wish.owner.id) {
        throw new ForbiddenException('Нельзя вносить деньги на свой подарок');
      }

      const totalRaised = wish.raised + createOfferDto.amount;
      if (totalRaised > wish.price) {
        throw new ForbiddenException('Сумма взноса превышает требуемую сумму');
      }

      await this.wishesService.update(createOfferDto.itemId, {
        raised: totalRaised,
      } as UpdateWishDto);

      const offer = await this.offerRepository.save({
        user,
        item: wish,
        amount: createOfferDto.amount,
      });

      await queryRunner.commitTransaction();
      return offer;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    return await this.offerRepository.find({
      relations: ['item', 'user'],
    });
  }

  async findOne(id: number) {
    return await this.offerRepository.findOne({
      where: { id },
      relations: ['item', 'user'],
    });
  }
}
