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
} from 'proto/listing';

@Controller()
@ListingServiceControllerMethods()
export class ListingController implements ListingServiceController {
  constructor(private readonly listingService: ListingService) {}

  async createListing(CreateListingDto: CreateListingDto) {
    const listing = await this.listingService.create(CreateListingDto);
    const protoListing: ProtoListing = {
      ListingID: listing.ListingID,
      Name: listing.Name,
      Datetime: listing.Datetime.toISOString(),
      ExpiryDate: listing.ExpiryDate.toDateString(),
      Category: listing.Category,
      Quantity: listing.Quantity,
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
    };

    return protoListing;
  }

  async findAllListings() {
    const listings = await this.listingService.findAll();

    // Transform listings to match ProtoLising structure
    const protoListings: ProtoListing[] = listings.map((listing) => ({
      ListingID: listing.ListingID,
      Name: listing.Name,
      Datetime: listing.Datetime.toISOString(),
      ExpiryDate: listing.ExpiryDate.toDateString(),
      Category: listing.Category,
      Quantity: listing.Quantity,
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
    }));

    const listingsResponse: Listings = {
      listings: protoListings,
    };

    return listingsResponse;
  }

  async findOneListing(FindOneListingDto: FindOneListingDto) {
    const listing = await this.listingService.findOne({
      ListingID: FindOneListingDto.ListingID,
    });

    const protoListing: ProtoListing = {
      ListingID: listing.ListingID,
      Name: listing.Name,
      Datetime: listing.Datetime.toISOString(),
      ExpiryDate: listing.ExpiryDate.toDateString(),
      Category: listing.Category,
      Quantity: listing.Quantity,
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
    };

    console.log(protoListing);
    return protoListing;
  }

  async updateListing(UpdateListingDto: UpdateListingDto) {
    const listing = await this.listingService.update(
      { ListingID: UpdateListingDto.ListingID },
      UpdateListingDto,
    );

    const protoListing: ProtoListing = {
      ListingID: listing.ListingID,
      Name: listing.Name,
      Datetime: listing.Datetime.toISOString(),
      ExpiryDate: listing.ExpiryDate.toDateString(),
      Category: listing.Category,
      Quantity: listing.Quantity,
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
    };

    return protoListing;
  }

  async removeListing(FindOneListingDto: FindOneListingDto) {
    const listing = await this.listingService.remove({
      ListingID: FindOneListingDto.ListingID,
    });

    const protoListing: ProtoListing = {
      ListingID: listing.ListingID,
      Name: listing.Name,
      Datetime: listing.Datetime.toISOString(),
      ExpiryDate: listing.ExpiryDate.toDateString(),
      Category: listing.Category,
      Quantity: listing.Quantity,
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
    };

    return protoListing;
  }
}
