import { Injectable } from '@nestjs/common';
import { Prisma, Listing } from '@prisma/client';
import { PrismaService } from './prisma.service';
import {
  UpdateListingDto,
  CreateListingDto,
  ProtoListing,
  Listings,
} from 'proto/listing';

@Injectable()
export class ListingService {
  constructor(private prisma: PrismaService) {}

  // Convert time string to date format to store in db
  convertTimeToDate(time: String) {
    const [hours, minutes] = time.split(':');
    return new Date(1970, 0, 1, Number(hours), Number(minutes));
  }

  // Convert UTC date to UTC+8
  parseDate(date: string) {
    const utc_date = new Date(date);
    utc_date.setHours(utc_date.getHours() + 8);
    return utc_date;
  }

  parseProtolisting(data: Listing): ProtoListing {
    return {
      ListingID: data.ListingID,
      UserID: data.UserID,
      Name: data.Name,
      Datetime: data.Datetime.toISOString(),
      ExpiryDate: data.ExpiryDate.toDateString(),
      Category: data.Category,
      Status: data.Status,
      Description: data.Description,
      Image: data.Image,
      PickUpAddressFirst: data.PickUpAddressFirst,
      PickUpAddressSecond: data.PickUpAddressSecond,
      PickUpAddressThird: data.PickUpAddressThird,
      PickUpPostalCode: data.PickUpPostalCode,
      PickUpStartDate: data.PickUpStartDate.toDateString(),
      PickUpEndDate: data.PickUpEndDate.toDateString(),
      PickUpStartTime: data.PickUpStartTime.toLocaleTimeString(),
      PickUpEndTime: data.PickUpEndTime.toLocaleTimeString(),
      ContactPhone: data.ContactPhone,
      ContactEmail: data.ContactEmail,
    };
  }

  parseProtolistingArray(data: Listing[]): Listings {
    const protoListings: ProtoListing[] = data.map((listing) => ({
      ListingID: listing.ListingID,
      UserID: listing.UserID,
      Name: listing.Name,
      Datetime: listing.Datetime.toISOString(),
      ExpiryDate: listing.ExpiryDate.toDateString(),
      Category: listing.Category,
      Status: listing.Status,
      Description: listing.Description,
      Image: listing.Image,
      PickUpAddressFirst: listing.PickUpAddressFirst,
      PickUpAddressSecond: listing.PickUpAddressSecond,
      PickUpAddressThird: listing.PickUpAddressThird,
      PickUpPostalCode: listing.PickUpPostalCode,
      PickUpStartDate: listing.PickUpStartDate.toDateString(),
      PickUpEndDate: listing.PickUpEndDate.toDateString(),
      PickUpStartTime: listing.PickUpStartTime.toLocaleTimeString(),
      PickUpEndTime: listing.PickUpEndTime.toLocaleTimeString(),
      ContactPhone: listing.ContactPhone,
      ContactEmail: listing.ContactEmail,
    }));

    return {
      listings: protoListings,
    };
  }

  async create(data: CreateListingDto): Promise<ProtoListing> {
    const listing = await this.prisma.listing.create({
      data: {
        ...data,
        Datetime: this.parseDate(data.Datetime),
        ExpiryDate: this.parseDate(data.ExpiryDate),
        PickUpStartDate: this.parseDate(data.PickUpStartDate),
        PickUpEndDate: this.parseDate(data.PickUpEndDate),
        PickUpStartTime: this.convertTimeToDate(data.PickUpStartTime),
        PickUpEndTime: this.convertTimeToDate(data.PickUpEndTime),
        Status: 1,
      },
    });

    return this.parseProtolisting(listing);
  }

  async findAll(): Promise<Listings> {
    return this.parseProtolistingArray(await this.prisma.listing.findMany());
  }

  async findAvailableExcludeUser(UserID: number): Promise<Listings> {
    return this.parseProtolistingArray(
      await this.prisma.listing.findMany({
        where: {
          UserID: {
            not: UserID,
          },
        },
      }),
    );
  }

  async findListingsByUserWithStatus(
    UserID: number,
    Status: number,
  ): Promise<Listings> {
    return this.parseProtolistingArray(
      await this.prisma.listing.findMany({
        where: {
          AND: [{ UserID: UserID }, { Status: Status }],
        },
      }),
    );
  }

  async findOne(
    ListingID: Prisma.ListingWhereUniqueInput,
  ): Promise<ProtoListing | null> {
    const listing = await this.prisma.listing.findUnique({
      where: ListingID,
    });

    return listing ? this.parseProtolisting(listing) : null;
  }

  async update(
    ListingID: Prisma.ListingWhereUniqueInput,
    UpdateListingDto: UpdateListingDto,
  ): Promise<ProtoListing> {
    return this.parseProtolisting(
      await this.prisma.listing.update({
        where: ListingID,
        data: UpdateListingDto,
      }),
    );
  }

  async remove(where: Prisma.ListingWhereUniqueInput): Promise<ProtoListing> {
    return this.parseProtolisting(
      await this.prisma.listing.delete({
        where,
      }),
    );
  }
}
