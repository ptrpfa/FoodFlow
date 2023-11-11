import { Controller } from '@nestjs/common';
import { ListingService } from './listing.service';
import {
  ListingServiceController,
  ListingServiceControllerMethods,
  CreateListingDto,
  FindOneListingDto,
  UpdateListingDto,
  ProtoListing,
  Listings,
  UserDto,
} from 'proto/listing';

@Controller()
@ListingServiceControllerMethods()
export class ListingController implements ListingServiceController {
  constructor(private readonly listingService: ListingService) {}

  async createListing(
    CreateListingDto: CreateListingDto,
  ): Promise<ProtoListing> {
    return this.listingService.create(CreateListingDto);
  }

  async findAllListings(): Promise<Listings> {
    return this.listingService.findAll();
  }

  async findAvailableListingsExcludeUser(
    request: UserDto,
  ): Promise<Listings | null> {
    return this.listingService.findAvailableExcludeUser(request.UserID);
  }

  async findReservedListings(request: UserDto): Promise<Listings | null> {
    return this.listingService.findListingsByUserWithStatus(request.UserID, 0);
  }

  async findAvailableListings(request: UserDto): Promise<Listings | null> {
    return this.listingService.findListingsByUserWithStatus(request.UserID, 1);
  }

  async findCollectedListings(request: UserDto): Promise<Listings | null> {
    return this.listingService.findListingsByUserWithStatus(request.UserID, 2);
  }

  async findOneListing(
    FindOneListingDto: FindOneListingDto,
  ): Promise<ProtoListing> {
    return this.listingService.findOne({
      ListingID: FindOneListingDto.ListingID,
    });
  }

  async updateListing(
    UpdateListingDto: UpdateListingDto,
  ): Promise<ProtoListing> {
    return this.listingService.update(
      { ListingID: UpdateListingDto.ListingID },
      UpdateListingDto,
    );
  }

  async removeListing(
    FindOneListingDto: FindOneListingDto,
  ): Promise<ProtoListing> {
    return this.listingService.remove({
      ListingID: FindOneListingDto.ListingID,
    });
  }
}
