/**
=========================================================
* Food Flow
=========================================================
* Template used - Material Dashboard 2 React - v2.1.0
* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)
=========================================================
*/

import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CircularProgress from '@mui/material/CircularProgress';

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import Divider from '@mui/material/Divider';
import MDSnackbar from "components/MDSnackbar";

import DashboardLayout from "page-components/LayoutContainers/DashboardLayout";
import DashboardNavbar from "page-components/Navbars/DashboardNavbar";
import Footer from "page-components/Footer";

import { AuthContext } from "context";
import AuthService from "../../services/auth-service";
import ListingService from "services/listing-service"; 
import AWSS3Service from "services/aws-s3-service";
// import reservationService from "services/reservation-service";

function FoodListingsTable({ onUserUpdate }) {
  const authContext = useContext(AuthContext);
  const [successSB, setSuccessSB] = useState(false);
  const [reservedListings, setReservedListings] = useState([]);
  const [availableListings, setAvailableListings] = useState([]);
  const [collectedListings, setCollectedListings] = useState([]);

  const [reservedLoaded, setReservedLoaded] = useState(false);
  const [availableLoaded, setAvailableLoaded] = useState(false);
  const [collectedLoaded, setCollectedLoaded] = useState(false);

  const [collectedItemName, setCollectedItemName] = useState("");
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    role: "",
  });

  const closeSuccessSB = () => setSuccessSB(false);

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

    ListingService.getReservedListings({ Userid: authContext.userID })
      .then(async (allListings) => {
        const listingsWithImages = await Promise.all(
          allListings.map(fetchImageForListing)
        );
        setReservedLoaded(true);
        setReservedListings(listingsWithImages);
      })
      .catch((error) => {
        console.error("Error fetching listings:", error);
      });

      ListingService.getAvailableListings({ Userid: authContext.userID })
      .then(async (allListings) => {
        const listingsWithImages = await Promise.all(
          allListings.map(fetchImageForListing)
        );
        setAvailableLoaded(true);
        setAvailableListings(listingsWithImages);
      })
      .catch((error) => {
        console.error("Error fetching listings:", error);
      });

      ListingService.getCollectedListings({ Userid: authContext.userID })
      .then(async (allListings) => {
        const listingsWithImages = await Promise.all(
          allListings.map(fetchImageForListing)
        );
        setCollectedLoaded(true);
        setCollectedListings(listingsWithImages);
      })
      .catch((error) => {
        console.error("Error fetching listings:", error);
      });
  }, [user.role, authContext.userID]);

  const convertUint8ArrayToBlob = (uint8Array) => {
    return new Blob([uint8Array], { type: 'image/jpeg' });
  };

  const groupedAvailableListings = [];
  for (let i = 0; i < availableListings.length; i += 3) {
    groupedAvailableListings.push(availableListings.slice(i, i + 3));
  }

  const groupedReservedListings = [];
  for (let i = 0; i < reservedListings.length; i += 3) {
    groupedReservedListings.push(reservedListings.slice(i, i + 3));
  }

  const groupedCollectedListings = [];
  for (let i = 0; i < collectedListings.length; i += 3) {
    groupedCollectedListings.push(collectedListings.slice(i, i + 3));
  }

  const collectedItem = (listingID) => {
    ListingService.updateListing({listingID: listingID, status: 2})
      .then(async (updatedListing) => {
        const collectedListing = reservedListings.find(listing => listing.listingID === listingID);
        const newReservedListings = reservedListings.filter(listing => listing.listingID !== listingID);
  
        // Set the new reserved listings without the one that has just been collected
        setReservedListings(newReservedListings);
  
        // Add the collected listing to the collectedListings array
        if (collectedListing) {
          setCollectedListings(prevCollectedListings => [...prevCollectedListings, collectedListing]);
        }

        setCollectedItemName(updatedListing.name);
      })
      .catch((error) => {
        console.error("Error updating listing:", error);
      });
      setSuccessSB(true);
  }

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
            My Listings
          </MDTypography>
        </MDBox>

        <MDBox pt={3}>
          <MDTypography variant="h4" mx={2} px={2} >
            Available
          </MDTypography>
          <Divider></Divider>
          {
            availableLoaded ? (
              groupedAvailableListings.length > 0 ? (
                groupedAvailableListings.map((rowListings, rowIndex) => (
                  <Grid container spacing={2} key={rowIndex}>
                    {
                      rowListings.map((listing, index) => (
                        <Grid item xs={4} key={index}>
                          <Card style={{ margin: "8px" }}>
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
                            </MDBox>
                          </Card>
                        </Grid>
                      ))
                    }
                  </Grid>
                  ))
              ) : (
                <MDTypography variant="h6" style={{ textAlign: 'center', margin: '1.5rem' }}>
                  No listings available.
                </MDTypography>
              )
            ) : (
              <MDBox textAlign="center">
                <CircularProgress/>
              </MDBox>
            )
          }
          <MDTypography variant="h4" mx={2} px={2} mt={2}>
            Reserved
          </MDTypography>
          <Divider></Divider>
          {
            reservedLoaded ? (
              groupedReservedListings.length > 0 ? (
                groupedReservedListings.map((rowListings, rowIndex) => (
                  <Grid container spacing={2} key={rowIndex}>
                    {
                      rowListings.map((listing, index) => (
                        <Grid item xs={4} key={index}>
                          <Card style={{ margin: "8px" }}>
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
                              <MDButton
                                variant="gradient"
                                color="success"
                                onClick={() => collectedItem(listing.listingID)}
                                fullWidth
                              >
                                Collected!
                              </MDButton>
                            </MDBox>
                          </Card>
                        </Grid>
                      ))
                    }
                  </Grid>
                ))
              ): (
                <MDTypography variant="h6" style={{ textAlign: 'center', margin: '1.5rem' }}>
                  No listings reserved.
                </MDTypography>
              )
            ) : (
              <MDBox textAlign="center">
                <CircularProgress/>
              </MDBox>
            )
          }
          <MDTypography variant="h4" mx={2} px={2} mt={2}>
            Collected
          </MDTypography>
          <Divider></Divider>
          {
            collectedLoaded ? (
              groupedCollectedListings.length > 0 ? (
                groupedCollectedListings.map((rowListings, rowIndex) => (
                  <Grid container spacing={2} key={rowIndex}>
                    {
                      rowListings.map((listing, index) => (
                        <Grid item xs={4} key={index}>
                          <Card style={{ margin: "8px" }}>
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
                            </MDBox>
                          </Card>
                        </Grid>
                      ))
                    }
                  </Grid>
                ))
              ): (
                  <MDTypography variant="h6" style={{ textAlign: 'center', margin: '1.5rem' }}>
                    No listings collected.
                  </MDTypography>
              )
            ) : (
              <MDBox textAlign="center">
                <CircularProgress/>
              </MDBox>
            )
          } 
        </MDBox>
      </Card>
        <MDSnackbar
        color="success"
        icon="check"
        title="Update success!"
        content={`Collected ${collectedItemName}!`}
        dateTime="Just"
        open={successSB}
        onClose={closeSuccessSB}
        close={closeSuccessSB}
        bgWhite
      />
    </div>
  );
}

function UserListings() {
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

export default UserListings;
