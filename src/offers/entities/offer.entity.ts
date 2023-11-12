import { Entity, Column, ManyToOne } from 'typeorm';
import { IsNumber } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';
import { BaseEntity } from '../../entities/base.entity';

@Entity()
export class Offer extends BaseEntity {
  @ManyToOne(() => User, (user) => user.offers)
  user: User;

  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish;

  @Column({ type: 'float' })
  @IsNumber({ maxDecimalPlaces: 2 })
  amount: number;

  @Column({ default: false })
  hidden: boolean;
}
