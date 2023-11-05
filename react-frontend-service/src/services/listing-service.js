import { ListingServiceClient } from "./grpc/listing/listing_grpc_web_pb";
import {
  CreateListingDto,
  FindOneListingDto,
  Empty,
  UpdateListingDto,
  UserDto,
} from "./grpc/listing/listing_pb";

const listing_client = new ListingServiceClient(
  "http://localhost:9900/grpc-listing",
  null,
  null
);

class ListingService {
  createListing = async (data) => {
    let message = new CreateListingDto();
    message.setUserid(data.UserID);
    message.setName(data.Name);
    message.setDatetime(data.Datetime);
    message.setExpirydate(data.ExpiryDate);
    message.setCategory(data.Category);
    message.setDescription(data.Description);
    message.setImage(data.Image);
    message.setPickupaddressfirst(data.PickUpAddressFirst);
    message.setPickupaddresssecond(data.PickUpAddressSecond);
    message.setPickupaddressthird(data.PickUpAddressThird);
    message.setPickuppostalcode(data.PickUpPostalCode);
    message.setPickupstartdate(data.PickUpStartDate);
    message.setPickupenddate(data.PickUpEndDate);
    message.setPickupstarttime(data.PickUpStartTime);
    message.setPickupendtime(data.PickUpEndTime);
    message.setContactphone(data.ContactPhone);
    message.setContactemail(data.ContactEmail);

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
          listingID: response.getListingid(),
          userID: response.getUserid(),
          name: response.getName(),
          datetime: response.getDatetime(),
          expiryDate: response.getExpirydate(),
          category: response.getCategory(),
          status: response.getStatus(),
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
          contactPhone: response.getContactphone(),
          contactEmail: response.getContactemail(),
        });
      });
    });
  };

  getAvailableListingsExcludeUser = async (payload) => {
    let message = new UserDto();
    message.setUserid(payload.Userid);

    return new Promise((resolve, reject) => {
      // gRPC
      listing_client.findAvailableListingsExcludeUser(
        message,
        null,
        (err, response) => {
          const listings = response.getListingsList();

          const processedListings = listings.map((listing) => {
            return {
              listingID: listing.getListingid(),
              userID: listing.getUserid(),
              name: listing.getName(),
              datetime: listing.getDatetime(),
              expiryDate: listing.getExpirydate(),
              category: listing.getCategory(),
              status: listing.getStatus(),
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
              contactPhone: listing.getContactphone(),
              contactEmail: listing.getContactemail(),
            };
          });
          resolve(processedListings);
        }
      );
    });
  };

  getReservedListings = async (payload) => {
    let message = new UserDto();
    message.setUserid(payload.Userid);

    return new Promise((resolve, reject) => {
      // gRPC
      listing_client.findReservedListings(message, null, (err, response) => {
        const listings = response.getListingsList();

        const processedListings = listings.map((listing) => {
          return {
            listingID: listing.getListingid(),
            userID: listing.getUserid(),
            name: listing.getName(),
            datetime: listing.getDatetime(),
            expiryDate: listing.getExpirydate(),
            category: listing.getCategory(),
            status: listing.getStatus(),
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
            contactPhone: listing.getContactphone(),
            contactEmail: listing.getContactemail(),
          };
        });
        resolve(processedListings);
      });
    });
  };

  getCollectedListings = async (payload) => {
    let message = new UserDto();
    message.setUserid(payload.Userid);

    return new Promise((resolve, reject) => {
      // gRPC
      listing_client.findCollectedListings(message, null, (err, response) => {
        const listings = response.getListingsList();

        const processedListings = listings.map((listing) => {
          return {
            listingID: listing.getListingid(),
            userID: listing.getUserid(),
            name: listing.getName(),
            datetime: listing.getDatetime(),
            expiryDate: listing.getExpirydate(),
            category: listing.getCategory(),
            status: listing.getStatus(),
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
            contactPhone: listing.getContactphone(),
            contactEmail: listing.getContactemail(),
          };
        });
        resolve(processedListings);
      });
    });
  };

  getAvailableListings = async (payload) => {
    let message = new UserDto();
    message.setUserid(payload.Userid);

    return new Promise((resolve, reject) => {
      // gRPC
      listing_client.findAvailableListings(message, null, (err, response) => {
        const listings = response.getListingsList();

        const processedListings = listings.map((listing) => {
          return {
            listingID: listing.getListingid(),
            userID: listing.getUserid(),
            name: listing.getName(),
            datetime: listing.getDatetime(),
            expiryDate: listing.getExpirydate(),
            category: listing.getCategory(),
            status: listing.getStatus(),
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
            contactPhone: listing.getContactphone(),
            contactEmail: listing.getContactemail(),
          };
        });
        resolve(processedListings);
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
            listingID: listing.getListingid(),
            userID: listing.getUserid(),
            name: listing.getName(),
            datetime: listing.getDatetime(),
            expiryDate: listing.getExpirydate(),
            category: listing.getCategory(),
            status: listing.getStatus(),
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
            contactPhone: listing.getContactphone(),
            contactEmail: listing.getContactemail(),
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
          listingID: response.getListingid(),
          userID: response.getUserid(),
          name: response.getName(),
          datetime: response.getDatetime(),
          expiryDate: response.getExpirydate(),
          category: response.getCategory(),
          status: response.getStatus(),
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
          contactPhone: response.getContactphone(),
          contactEmail: response.getContactemail(),
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
    message.setStatus(payload.status);
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
    message.setContactphone(payload.ContactPhone);
    message.setContactemail(payload.ContactEmail);

    return new Promise((resolve, reject) => {
      // gRPC
      listing_client.updateListing(message, null, (err, response) => {
        resolve({
          listingID: response.getListingid(),
          userID: response.getUserid(),
          name: response.getName(),
          datetime: response.getDatetime(),
          expiryDate: response.getExpirydate(),
          category: response.getCategory(),
          status: response.getStatus(),
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
          contactPhone: response.getContactphone(),
          contactEmail: response.getContactemail(),
        });
      });
    });
  };
}

export default new ListingService();
