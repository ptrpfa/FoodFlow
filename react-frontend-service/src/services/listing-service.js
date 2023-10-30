import { ListingServiceClient } from "./grpc/listing/listing_grpc_web_pb";
import {
  CreateListingDto,
  FindOneListingDto,
  Empty,
  UpdateListingDto,
} from "./grpc/listing/listing_pb";

const listing_client = new ListingServiceClient(
  "http://localhost:9900/grpc-listing",
  null,
  null
);

class ListingService {
  createListing = async (data) => {
    let message = new CreateListingDto();
    message.setName(data.Name);
    message.setDatetime(data.Datetime);
    message.setExpiryDate(data.ExpiryDate);
    message.setCategory(data.Category);
    message.setQuantity(data.Quantity);
    message.setDescription(data.Description);
    message.setImage(data.Image);
    message.setPickupaddressfirst(data.PickUpAddressFirst);
    message.setPickupAddresssecond(data.PickUpAddressSecond);
    message.setPickupAddressthird(data.PickUpAddressThird);
    message.setPickuppostalcode(data.PickUpPostalCode);
    message.setPickupstartdate(data.PickUpStartDate);
    message.setPickupenddate(data.PickUpEndDate);
    message.setPickupstarttime(data.PickUpStartTime);
    message.setPickupendtime(data.PickUpEndTime);

    return new Promise((resolve, reject) => {
      // gRPC
      listing_client.createListing(message, null, (err, response) => {
        resolve({
          listingID: response.getListingid(),
        });
      });
    });
  };

  getListing = async (payload) => {
    let message = new FindOneListingDto();
    message.setListingid(payload.ListingID);

    return new Promise((resolve, reject) => {
      // gRPC
      listing_client.findOneListing(message, null, (err, response) => {
        resolve({
          name: response.getName(),
          datetime: response.getDatetime(),
          expiryDate: response.getExpirydate(),
          category: response.getCategory(),
          quantity: response.getQuantity(),
          description: response.getDescription(),
          image: response.getImage(),
          pickUpAddressFirst: response.getPickupaddressfirst(),
          pickUpAddressSecond: response.getPickupaddresssecond(),
          pickUpAddressThird: response.getPickupaddressthird(),
          pickUpPostalCode: response.getPickuppostalcode(),
          pickUpStartDate: response.getPickupstartdate(),
          pickUpEndDate: response.getPickupenddate(),
          pickUpStartTime: response.getPickupstarttime(),
          pickUpEndTime: response.getPickupendtime(),
        });
      });
    });
  };

  getAllListing = async () => {
    let message = new Empty();

    return new Promise((resolve, reject) => {
      // gRPC
      listing_client.findAllListings(message, null, (err, response) => {
        const listings = response.getListingsList();

        const processedListings = listings.map((listing) => {
          return {
            name: listing.getName(),
            datetime: listing.getDatetime(),
            expiryDate: listing.getExpirydate(),
            category: listing.getCategory(),
            quantity: listing.getQuantity(),
            description: listing.getDescription(),
            image: listing.getImage(),
            pickUpAddressFirst: listing.getPickupaddressfirst(),
            pickUpAddressSecond: listing.getPickupaddresssecond(),
            pickUpAddressThird: listing.getPickupaddressthird(),
            pickUpPostalCode: listing.getPickuppostalcode(),
            pickUpStartDate: listing.getPickupstartdate(),
            pickUpEndDate: listing.getPickupenddate(),
            pickUpStartTime: listing.getPickupstarttime(),
            pickUpEndTime: listing.getPickupendtime(),
          };
        });
        resolve(processedListings);
      });
    });
  };

  deleteListing = async (payload) => {
    let message = new FindOneListingDto();
    message.setListingid(payload.ListingID);

    return new Promise((resolve, reject) => {
      // gRPC
      listing_client.removeListing(message, null, (err, response) => {
        resolve({
          name: response.getName(),
          datetime: response.getDatetime(),
          expiryDate: response.getExpirydate(),
          category: response.getCategory(),
          quantity: response.getQuantity(),
          description: response.getDescription(),
          image: response.getImage(),
          pickUpAddressFirst: response.getPickupaddressfirst(),
          pickUpAddressSecond: response.getPickupaddresssecond(),
          pickUpAddressThird: response.getPickupaddressthird(),
          pickUpPostalCode: response.getPickuppostalcode(),
          pickUpStartDate: response.getPickupstartdate(),
          pickUpEndDate: response.getPickupenddate(),
          pickUpStartTime: response.getPickupstarttime(),
          pickUpEndTime: response.getPickupendtime(),
        });
      });
    });
  };

  // TODO: implement
  updateListing = async (payload) => {
    let message = new UpdateListingDto();
    message.setListingid(payload.listingID);
    message.setName(payload.name);
    message.setDatetime(payload.datetime);
    message.setExpirydate(payload.expirydate);
    message.setCategory(payload.category);
    message.setQuantity(payload.quantity);
    message.setDescription(payload.description);
    message.setImage(payload.image);
    message.setPickupaddressfirst(payload.pickupaddressfirst);
    message.setPickupaddresssecond(payload.pickupaddresssecond);
    message.setPickupaddressthird(payload.pickupaddressthird);
    message.setPickuppostalcode(payload.pickuppostalcode);
    message.setPickupstartdate(payload.pickupstartdate);
    message.setPickupenddate(payload.pickupenddate);
    message.setPickupstarttime(payload.pickupstarttime);
    message.setPickupendtime(payload.pickupendtime);

    return new Promise((resolve, reject) => {
      // gRPC
      listing_client.updateListing(message, null, (err, response) => {
        resolve({
          name: response.getName(),
          datetime: response.getDatetime(),
          expiryDate: response.getExpirydate(),
          category: response.getCategory(),
          quantity: response.getQuantity(),
          description: response.getDescription(),
          image: response.getImage(),
          pickUpAddressFirst: response.getPickupaddressfirst(),
          pickUpAddressSecond: response.getPickupaddresssecond(),
          pickUpAddressThird: response.getPickupaddressthird(),
          pickUpPostalCode: response.getPickuppostalcode(),
          pickUpStartDate: response.getPickupstartdate(),
          pickUpEndDate: response.getPickupenddate(),
          pickUpStartTime: response.getPickupstarttime(),
          pickUpEndTime: response.getPickupendtime(),
        });
      });
    });
  };
}

export default new ListingService();
