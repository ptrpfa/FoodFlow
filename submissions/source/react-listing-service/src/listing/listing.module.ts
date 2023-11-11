import { Module } from '@nestjs/common';
import { ListingService } from './listing.service';
import { ListingController } from './listing.controller';
import { PrismaService } from './prisma.service';

@Module({
  imports: [ListingModule],
  controllers: [ListingController],
  providers: [ListingService, PrismaService],
})
export class ListingModule {}
