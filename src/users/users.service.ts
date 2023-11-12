import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { hashPassword } from '../misc/hash';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const password = await hashPassword(createUserDto.password);
    const user = this.usersRepository.create({
      ...createUserDto,
      password,
    });
    return await this.usersRepository.save(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto?.password) {
      updateUserDto.password = await hashPassword(updateUserDto.password);
    }

    return this.usersRepository.update(id, updateUserDto);
  }

  async findById(id: number) {
    return await this.usersRepository.findOneBy({ id });
  }

  async getUserByUsername(username: string) {
    return await this.usersRepository.findOneBy({ username });
  }

  async getUserByQuery(query: string) {
    if (query.includes('@')) {
      return await this.usersRepository.findOneBy({ email: query });
    } else {
      return await this.getUserByUsername(query);
    }
  }

  async getUserWishes(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['wishes'],
    });
    return user.wishes;
  }

  async getWishesByUsername(username: string) {
    const user = await this.usersRepository.findOne({
      where: { username },
      relations: ['wishes'],
    });
    return user.wishes;
  }
}
