import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDSnackbar from "components/MDSnackbar";
import MDButton from "components/MDButton";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import { AuthContext } from "context";
import AuthService from "../../../services/auth-service";
import ListingService from "services/listing-service"; 
import AWSS3Service from "services/aws-s3-service";
import reservationService from "services/reservation-service";

import WebSocketService from "services/web-listener.js";


function FoodListingsTable({ onUserUpdate }) {
  const authContext = useContext(AuthContext);
  const [listings, setListings] = useState([]);
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    role: "",
  });

  const getUserData = async (UserID) => {
    try {
      const response = await AuthService.getProfile({ UserID: UserID });

      if (response) {;
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
  }, []);

  useEffect(() => {
    const fetchImageForListing = async (listing) => {
      const imageData = await AWSS3Service.getImage({ imageId: listing.image });
      const imageBlob = convertUint8ArrayToBlob(imageData.imageData);
      const imageUrl = URL.createObjectURL(imageBlob);
      return { ...listing, image: imageUrl };
    };

    if (user.role === "patron") {
      ListingService.getAvailableListingsExcludeUser({ Userid: authContext.userID })
        .then(async (allListings) => {
          const listingsWithImages = await Promise.all(
            allListings.map(fetchImageForListing)
          );
          setListings(listingsWithImages);
        })
        .catch((error) => {
          console.error("Error fetching listings:", error);
        });
    } 
    else if (user.role === "donor") {
      ListingService.getAvailableListingsExcludeUser({ Userid: authContext.userID })
        .then(async (allListings) => {
          const listingsWithImages = await Promise.all(
            allListings.map(fetchImageForListing)
          );
          setListings(listingsWithImages);
        })
        .catch((error) => {
          console.error("Error fetching listings for donors:", error);
        });
    }
  }, [user.role, authContext.userID]);

  const convertUint8ArrayToBlob = (uint8Array) => {
    return new Blob([uint8Array], { type: 'image/jpeg' });
  };

  const groupedListings = [];
  for (let i = 0; i < listings.length; i += 3) {
    groupedListings.push(listings.slice(i, i + 3));
  }

  const handleReservation = (product_id) => {
    const quantity = 5;
    reservationService.makeReservation(product_id, quantity)
      // .then(data => {
      //   setMessage(data.message);
      // })
      .catch(error => {
        console.log("Reservation failed:", error);
        setMessage("Reservation failed");
      });
  }

  const [messageSnackbar, setMessageSnackbar] = useState({ open: false, message: "" });
  const closeMessageSnackbar = () => {
    setMessageSnackbar({ open: false, message: "" });
  }

  const webSocketService = new WebSocketService();

  webSocketService.onmessage = (message) => {

    // Update the state to open the MDSnackbar with the received message
    setMessageSnackbar({ open: true, message: message });
    
  };

  const renderServerSB = (<MDSnackbar
    icon="info"
    title="Server Message:"
    content={messageSnackbar.message}
    dateTime="5 seconds ago"
    open={messageSnackbar.open}
    onClose={closeMessageSnackbar}
    close={closeMessageSnackbar}
  />);


  return (
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
          <MDTypography variant="h6" color="white">
            Available Donated Food
          </MDTypography>
        </MDBox>
        <MDBox pt={3}>
          {groupedListings.map((rowListings, rowIndex) => (
            <Grid container spacing={2} key={rowIndex}>
              {rowListings.map((listing, index) => (
                <Grid item xs={4} key={index}>
                    <Card style={{ margin: "8px"}}>
                      <MDBox p={2}>
                        <MDTypography variant="h6">{listing.name}</MDTypography>
                        <div style={{ display: 'flex', justifyContent: 'center', margin: "0.5rem", height:"12rem"}}>
                          <img 
                            src={listing.image}
                            style={{ maxWidth: "70%", maxHeight: "70%", margin:"auto"}}
                            alt={listing.name}
                          />
                        </div>
                        <div style={{height:"3rem", }}>
                          <MDTypography style={{ fontStyle: 'italic', fontSize:"1rem" }}>{listing.description}</MDTypography>
                        </div>
                        <MDButton
                          variant="gradient"
                          color="info"
                          component={Link}
                          to={`/listings/${listing.listingID}`}
                          style={{ marginBottom: "1rem", marginTop: "1rem"}}
                          fullWidth
                        >
                          View Details
                        </MDButton>
                        {}
                        <MDButton
                          variant="gradient"
                          color="warning"
                          onClick={() => handleReservation(listing.listingID)}
                          fullWidth
                        >
                          Reserve
                        </MDButton>
                        {renderServerSB}
                      </MDBox>
                    </Card>
                </Grid>
              ))}
            </Grid>
          ))}
        </MDBox>
      </Card>
    </div>
  );
}

function Listings() {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    role: "",
  });

  // Callback function to update the user data in the parent component
  const handleUserUpdate = (userData) => {
    setUser(userData);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <MDTypography variant="h3">{user.firstName} {user.lastName}'s Listings</MDTypography>
              <Link to="/upload">
                <MDButton variant="gradient" color="info">
                  Donate Food
                </MDButton>
              </Link>
            </div>
          </Grid>
          <Grid item xs={12}>
            <FoodListingsTable onUserUpdate={handleUserUpdate} />
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Listings;
