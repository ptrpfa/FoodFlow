import { Injectable } from '@nestjs/common';
import { Prisma, Listing } from '@prisma/client';
import { PrismaService } from './prisma.service';
import { UpdateListingDto, CreateListingDto } from 'proto/listing';

@Injectable()
export class ListingService {
  constructor(private prisma: PrismaService) {}

  convertTimeToDate(time: String) {
    const [hours, minutes] = time.split(':');
    return new Date(1970, 0, 1, Number(hours), Number(minutes));
  }

  parseDate(date: string) {
    const utc_date = new Date(date);
    utc_date.setHours(utc_date.getHours() + 8);
    return utc_date;
  }
  async create(data: CreateListingDto): Promise<Listing> {
    const listing = await this.prisma.listing.create({
      data: {
        ...data,
        Datetime: this.parseDate(data.Datetime),
        ExpiryDate: this.parseDate(data.ExpiryDate),
        PickUpStartDate: this.parseDate(data.PickUpStartDate),
        PickUpEndDate: this.parseDate(data.PickUpEndDate),
        PickUpStartTime: this.convertTimeToDate(data.PickUpStartTime),
        PickUpEndTime: this.convertTimeToDate(data.PickUpEndTime),
      },
    });

    return listing;
  }

  async findAll(): Promise<Listing[]> {
    return this.prisma.listing.findMany();
  }

  async findOne(
    ListingID: Prisma.ListingWhereUniqueInput,
  ): Promise<Listing | null> {
    return this.prisma.listing.findUnique({
      where: ListingID,
    });
  }

  async update(
    ListingID: Prisma.ListingWhereUniqueInput,
    UpdateListingDto: UpdateListingDto,
  ): Promise<Listing> {
    return this.prisma.listing.update({
      where: ListingID,
      data: UpdateListingDto,
    });
  }

  async remove(where: Prisma.ListingWhereUniqueInput): Promise<Listing> {
    return this.prisma.listing.delete({
      where,
    });
  }
}
