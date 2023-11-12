import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
    private dataSource: DataSource,
  ) {}

  async create(user: User, createWishDto: CreateWishDto) {
    return await this.wishRepository.save({
      ...createWishDto,
      owner: user,
    });
  }

  async findLast() {
    return await this.wishRepository.find({
      order: { createdAt: 'desc' },
    });
  }

  async findTop() {
    return await this.wishRepository.find({
      order: { copied: 'desc' },
    });
  }

  async findOne(id: number) {
    return this.wishRepository.findOne({
      where: { id },
      relations: ['owner'],
    });
  }

  async update(id: number, updateWishDto: UpdateWishDto) {
    return await this.wishRepository.update(id, updateWishDto);
  }

  async removeOne(userId: number, wishId: number) {
    const wish = await this.wishRepository.findOne({
      where: { id: wishId },
      relations: ['owner'],
    });

    if (userId !== wish.owner.id) {
      throw new ForbiddenException();
    }

    return await this.wishRepository.delete(wishId);
  }

  async getWishesByIds(ids: number[]) {
    return await this.wishRepository.find({
      where: { id: In(ids) },
    });
  }

  async copyWish(user: User, wishId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const wish = await this.wishRepository.findOne({ where: { id: wishId } });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, createdAt, updatedAt, owner, copied, raised, ...newData } =
        wish;
      const copiedWish = await this.wishRepository.save({
        ...newData,
        owner: user,
      });
      await this.wishRepository.update(wishId, {
        copied: wish.copied + 1,
      });

      await queryRunner.commitTransaction();
      return copiedWish;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
