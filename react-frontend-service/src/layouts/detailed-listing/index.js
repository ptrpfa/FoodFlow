import { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import { AuthContext } from "context";
import AuthService from "../../services/auth-service";
import ListingService from "services/listing-service";
import AWSS3Service from "services/aws-s3-service";
import listingService from "services/listing-service";

function DetailedListing(onUserUpdate) {
  const { listingID } = useParams();
  const [listing, setListing] = useState(null);
  const authContext = useContext(AuthContext);
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    role: "",
  });

  const convertUint8ArrayToBlob = (uint8Array) => {
    return new Blob([uint8Array], { type: 'image/jpeg' });
  };

  const handleReservation = () => {
    // reservationService.makeReservation("This is a test reservation.")
    //   .then(data => {
    //     setMessage(data.message);
    //   })
    //   .catch(error => {
    //     console.error("Reservation failed:", error);
    //     setMessage("Reservation failed");
    //   });
  }

  const getUserData = async (UserID) => {
    try {
      const response = await AuthService.getProfile({ UserID: UserID });
  
      if (response) {
        const role = response.role;
        const firstName = response.firstName;
        const lastName = response.LastName;
  
        setUser((prevUser) => ({
          ...prevUser,
          firstName,
          lastName,
          role,
        }));
  
        onUserUpdate({ firstName, lastName });
      } else {
        console.error("User data not found.");
      }
    } catch (error) {
      console.error("An error occurred while fetching user data:", error);
    }
  };
  
  useEffect(() => {
    getUserData(authContext.userID);
  }, [authContext.userID]);
  
  useEffect(() => {
    const fetchImageForListing = async (listing) => {
      const imageData = await AWSS3Service.getImage({ imageId: listing.image });
      const imageBlob = convertUint8ArrayToBlob(imageData.imageData);
      const imageUrl = URL.createObjectURL(imageBlob);
      return { ...listing, image: imageUrl };
    };
  
    const fetchListingDetails = async () => {
      try {
        const response = await ListingService.getListing({ ListingID: listingID });
        setListings([response]); // Wrap the response in an array
        console.log(response);
      } catch (error) {
        console.error('Error fetching listing details:', error);
      }
    };
  
    // Fetch user data
    getUserData(authContext.userID);
  
    // Fetch listing data when listingID or user.role changes
    fetchListingDetails();
  
    if (user.role === "patron") {
      ListingService.getAvailableListings(authContext.userID)
        .then(async (allListings) => {
          const listingsWithImages = await Promise.all(
            allListings.map(fetchImageForListing)
          );
          setListings(listingsWithImages);
        })
        .catch((error) => {
          console.error("Error fetching listings:", error);
        });
    } else if (user.role === "donor") {
      ListingService.getAvailableListingsExcludeUser(authContext.userID)
        .then(async (allListings) => {
          const listingsWithImages = await Promise.all(
            allListListings.map(fetchImageForListing)
          );
          setListings(listingsWithImages);
        })
        .catch((error) => {
          console.error("Error fetching listings for donors:", error);
        });
    }
  }, [user.role, authContext.userID]);

  return (
    <div>
      {listing ? (
        <div>
          <Card>
            <MDBox
              mx={2}
              mt={-3}
              py={3}
              px={2}
              variant="gradient"
              bgColor="info"
              borderRadius="lg"
              coloredShadow="info"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <MDTypography variant="h5" color="white">
                  {listing.name}
                </MDTypography>

                {/* To Handle Reservation!!!!! */}
                <MDButton variant="gradient" color="warning" onClick={handleReservation}>
                  Reserve
                </MDButton>
              </div>

            </MDBox>
            <MDBox pt={3} ml={2}>
              <div style={{ display: 'flex' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'left', margin: '0.5rem', height: '20rem' }}>
                    <img
                      src={listing.image}
                      style={{ maxWidth: '90%', maxHeight: '90%', margin: 'auto' }}
                      alt={listing.name}
                    />
                  </div>
                </div>

                <div style={{ flex: 1 }}>
                  <MDTypography variant='h6' style={{ color: '#808080' }}>
                    Expiry Date: {listing.expiryDate}
                  </MDTypography>
                  <MDTypography variant="p" style={{ fontStyle: 'italic', fontSize: '1rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {listing.description}
                  </MDTypography>


                  <Card style={{ marginTop: '15px', width: '90%' }}>
                    <MDBox p={2}>
                      <MDTypography variant='h5' style={{ paddingBottom: '10px' }}>Contact Details</MDTypography>
                      <MDTypography variant="p" style={{ fontSize: '1rem' }}>
                        <div>{listing.contactPhone}</div>
                        <div>{listing.contactEmail}</div>
                      </MDTypography>
                    </MDBox>
                  </Card>
                  <Card style={{ marginTop: '15px', marginBottom: '50px', width: '90%' }}>
                    <MDBox p={2}>
                      <MDTypography variant='h5' style={{ paddingBottom: '10px' }}>Collection Details</MDTypography>
                      <MDTypography variant="p" style={{ fontSize: '1rem' }}>
                        <div>{listing.pickUpAddressFirst} {listing.pickUpAddressSecond}</div>
                        <div>{listing.pickUpAddressThird}, {listing.pickUpPostalCode}</div>
                      </MDTypography>
                      <MDTypography variant='h6' style={{ paddingTop: '15px', paddingBottom: '5px' }}>Pick Up From</MDTypography>
                      <MDTypography variant="p" style={{ fontSize: '1rem' }}>
                        <div>{listing.pickUpStartDate}, {listing.pickUpStartTime}</div>
                      </MDTypography>
                      <MDTypography variant='h6' style={{ paddingTop: '15px', paddingBottom: '5px' }}>Pick Up By</MDTypography>
                      <MDTypography variant="p" style={{ fontSize: '1rem' }}>
                        <div>{listing.pickUpEndDate}, {listing.pickUpEndTime}</div>
                      </MDTypography>
                    </MDBox>
                  </Card>

                </div>
              </div>
            </MDBox>


          </Card>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

function Detail() {

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <DetailedListing />
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Detail;
