import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@UseGuards(JwtGuard)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  async create(@Request() { user }, @Body() createOfferDto: CreateOfferDto) {
    return await this.offersService.create(user, createOfferDto);
  }

  @Get()
  async findAll() {
    return await this.offersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.offersService.findOne(id);
  }
}
