/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "listing";

export interface UpdateListingDto {
  ListingID: number;
  Name?: string | undefined;
  Datetime?: string | undefined;
  ExpiryDate?: string | undefined;
  Category?: string | undefined;
  Quantity?: number | undefined;
  Description?: string | undefined;
  Image?: string | undefined;
  PickUpAddressFirst?: string | undefined;
  PickUpAddressSecond?: string | undefined;
  PickUpAddressThird?: string | undefined;
  PickUpPostalCode?: string | undefined;
  PickUpStartDate?: string | undefined;
  PickUpEndDate?: string | undefined;
  PickUpStartTime?: string | undefined;
  PickUpEndTime?: string | undefined;
}

export interface FindOneListingDto {
  ListingID: number;
}

export interface Empty {
}

export interface Listings {
  listings: ProtoListing[];
}

export interface CreateListingDto {
  ListingID: number;
  Name: string;
  Datetime: string;
  ExpiryDate: string;
  Category: string;
  Quantity: number;
  Description: string;
  Image: string;
  PickUpAddressFirst: string;
  PickUpAddressSecond: string;
  PickUpAddressThird: string;
  PickUpPostalCode: string;
  PickUpStartDate: string;
  PickUpEndDate: string;
  PickUpStartTime: string;
  PickUpEndTime: string;
}

export interface ProtoListing {
  ListingID: number;
  Name: string;
  Datetime: string;
  ExpiryDate: string;
  Category: string;
  Quantity: number;
  Description: string;
  Image: string;
  PickUpAddressFirst: string;
  PickUpAddressSecond: string;
  PickUpAddressThird: string;
  PickUpPostalCode: string;
  PickUpStartDate: string;
  PickUpEndDate: string;
  PickUpStartTime: string;
  PickUpEndTime: string;
}

export const LISTING_PACKAGE_NAME = "listing";

export interface ListingServiceClient {
  createListing(request: CreateListingDto): Observable<ProtoListing>;

  findAllListings(request: Empty): Observable<Listings>;

  findOneListing(request: FindOneListingDto): Observable<ProtoListing>;

  updateListing(request: UpdateListingDto): Observable<ProtoListing>;

  removeListing(request: FindOneListingDto): Observable<ProtoListing>;
}

export interface ListingServiceController {
  createListing(request: CreateListingDto): Promise<ProtoListing> | Observable<ProtoListing> | ProtoListing;

  findAllListings(request: Empty): Promise<Listings> | Observable<Listings> | Listings;

  findOneListing(request: FindOneListingDto): Promise<ProtoListing> | Observable<ProtoListing> | ProtoListing;

  updateListing(request: UpdateListingDto): Promise<ProtoListing> | Observable<ProtoListing> | ProtoListing;

  removeListing(request: FindOneListingDto): Promise<ProtoListing> | Observable<ProtoListing> | ProtoListing;
}

export function ListingServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "createListing",
      "findAllListings",
      "findOneListing",
      "updateListing",
      "removeListing",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("ListingService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("ListingService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const LISTING_SERVICE_NAME = "ListingService";
