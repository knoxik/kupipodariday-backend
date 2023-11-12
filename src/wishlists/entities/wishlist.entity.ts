import { Entity, Column, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { Length, IsUrl } from 'class-validator';
import { Wish } from '../../wishes/entities/wish.entity';
import { User } from '../../users/entities/user.entity';
import { BaseEntity } from 'src/entities/base.entity';

@Entity()
export class Wishlist extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 250,
  })
  @Length(1, 250)
  name: string;

  @Column({
    type: 'varchar',
    length: 1500,
  })
  @Length(1, 1500)
  description: string;

  @Column()
  @IsUrl()
  image: string;

  @ManyToMany(() => Wish)
  @JoinTable()
  items: Wish[];

  @ManyToOne(() => User, (user) => user.whishlists)
  owner: User;
}
