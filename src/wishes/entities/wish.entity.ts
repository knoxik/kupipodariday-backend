import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Length, IsUrl, IsNumber, Min } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { Offer } from '../../offers/entities/offer.entity';

@Entity()
export class Wish {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 250,
  })
  @Length(1, 250)
  name: string;

  @Column()
  @IsUrl()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column({ type: 'float' })
  @IsNumber({ maxDecimalPlaces: 2 })
  price: number;

  @Column({ type: 'float', default: 0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  raised: number;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @Column({
    type: 'varchar',
    length: 1024,
  })
  @Length(1, 1024)
  description: string;

  @Column({
    default: 0,
  })
  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(0)
  copied: number;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
