import { Module } from '@nestjs/common';
import { ListingModule } from './listing/listing.module';

@Module({
  imports: [ListingModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
