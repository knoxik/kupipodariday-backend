import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishlistsService } from './wishlists.service';
import { Wishlist } from './entities/wishlist.entity';
import { WishlistsController } from './wishlists.controller';
import { WishesModule } from '../wishes/wishes.module';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wishlist, User]),
    WishesModule,
    UsersModule,
  ],
  controllers: [WishlistsController],
  providers: [WishlistsService],
  exports: [WishlistsService],
})
export class WishlistsModule {}
