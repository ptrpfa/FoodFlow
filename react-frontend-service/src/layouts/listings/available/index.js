/**
=========================================================
* Food Flow
=========================================================
* Template used - Material Dashboard 2 React - v2.1.0
* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)
=========================================================
*/

import { useState, useEffect, useContext, useMemo } from "react";
import { Link } from "react-router-dom";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CircularProgress from '@mui/material/CircularProgress';

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDSnackbar from "components/MDSnackbar";
import MDButton from "components/MDButton";

import DashboardLayout from "page-components/LayoutContainers/DashboardLayout";
import DashboardNavbar from "page-components/Navbars/DashboardNavbar";
import Footer from "page-components/Footer";

import { AuthContext } from "context";
import AuthService from "../../../services/auth-service";
import ListingService from "services/listing-service"; 
import ImageClassifierService from "services/image-classification-service";
import AWSS3Service from "services/aws-s3-service";

import { v4 as uuidv4 } from "uuid"; 
import reservationService from "services/reservation-service";
import WebSocketService from "services/web-listener";
import { startInterval } from "services/interval";



function FoodListingsTable({ onUserUpdate }) {
  const authContext = useContext(AuthContext);
  // const [message, setMessage] = useState(''); 
  const [listings, setListings] = useState([]);
  const [groupedListings, setGroupedListings] = useState([]);
  const [reservedListings, setReservedListings] = useState([]);
  const [reservingListingID, setReservingListingID] = useState(0);  
  const [reserved, setReserved] = useState(false);  
  const [fetchError, setFetchError] = useState(false);  
  const [isLoading, setIsLoading] = useState(false);
  const [trainingModel, setTrainingModel] = useState(-1);
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    role: "",
  });

  const [messageSnackbar, setMessageSnackbar] = useState({ open: false, message: "" });
  const [openDialog, setOpenDialog] = useState(false);
  const webSocketService = useMemo(() => new WebSocketService(), []);

  // Open dialog
  const handleReport = () => {
    setOpenDialog(true);
  };

  // Close dialog
  const handleClose = () => {
    setOpenDialog(false);
  };

  // Close snackbar
  const closeMessageSnackbar = () => {
    setMessageSnackbar({ open: false, message: "" });
  }

  // Get user data (role, firstname, lastname)
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
        setFetchError(true);
        console.error("User data not found.");
      }
    } catch (error) {
      setFetchError(true);
      console.error("An error occurred while fetching user data:", error);
    }
  };

  // Converts s3 return value to blob
  const convertUint8ArrayToBlob = (uint8Array) => {
    return new Blob([uint8Array], { type: 'image/jpeg' });
  };

  // Trains model on freshness report
  const handleReportConfirmation = async (imageData, listingID) => {
    setOpenDialog(false);
    setTrainingModel(listingID);
    const response = await fetch(imageData);
    const blob = await response.blob();

    // Train client side model
    await ImageClassifierService.train_model(blob, 1);

    // Upload model
    await ImageClassifierService.upload_model();

    // Add the listing ID to the reported list in local storage
    const reportedListings = JSON.parse(localStorage.getItem('reportedListings') || '[]');
    const updatedReportedListings = [...reportedListings, listingID];
    localStorage.setItem('reportedListings', JSON.stringify(updatedReportedListings));

    setTrainingModel(-1);
  };

  // Check if user already reported the listing with listingID
  const isListingReported = (listingID) => {
    const reportedListings = JSON.parse(localStorage.getItem('reportedListings') || '[]');
    return reportedListings.includes(listingID);
  };

  // User click 'reserve' button 
  var checkLocalStorageInterval = null;
  const handleReservation = (listingID) => {
    const LOCAL_STORAGE_KEY = uuidv4(); 
    // Calls reservation-service.js
    setReservingListingID(listingID);
    // Start the timer
    const {promise, interval} = startInterval(LOCAL_STORAGE_KEY);
    checkLocalStorageInterval = interval;

    reservationService.makeReservation(authContext.userID, listingID, LOCAL_STORAGE_KEY)
    .then(data => {
      clearInterval(checkLocalStorageInterval);
      if(data){
          setMessageSnackbar({ open: true, message: data });
      }
    });

    promise.then(data => {
      if(data){
        setMessageSnackbar({ open: true, message: data });
      }
    });
  };

  // Clean up socket
  function socketCleanup(){
    if (webSocketService.socket && webSocketService.socket.readyState === WebSocket.OPEN) {
      webSocketService.socket.close();
    }
    if (checkLocalStorageInterval) {
      clearInterval(checkLocalStorageInterval);
    }
  }

  // Set up web socket
  useEffect(() => {
    async function connectWebSocket() {
      await webSocketService.setupWebSocket();
      
      webSocketService.onmessage = (message) => {
        console.log(message);
        // Update the state to open the MDSnackbar with the received message
        clearInterval(checkLocalStorageInterval);
        setMessageSnackbar({ open: true, message: message });
        setReserved(true);
      };
    }
    
    connectWebSocket();
      
    return () => {
      // Cleanup function
      socketCleanup();
    }
  }, []);

  // Prepare federated model
  useEffect(() => {
    async function prepareModel(){
      try {
        await ImageClassifierService.prepare_ml();
      } catch (error) {
        console.error('Error loading models', error);
      } finally {
        setIsLoading(false);
      }
    }
    prepareModel();

    return () => {
      ImageClassifierService.dispose_models();
    };
  }, []);

  // Prepare listings, and set loading to true
  useEffect(() => {
    setIsLoading(true);
    const fetchImageForListing = async (listing) => {

      try {
        const imageData = await AWSS3Service.getImage({ imageId: listing.image });
        const imageBlob = convertUint8ArrayToBlob(imageData.imageData);
        const imageUrl = URL.createObjectURL(imageBlob);
        return { ...listing, image: imageUrl };
      } catch (error) {  
        setFetchError(true);
        console.error("Error fetching images:", error);
        return { ...listing, image: null };
      }

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
          setFetchError(true);
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
          setFetchError(true);
          console.error("Error fetching listings for donors:", error);
        });
    }
  }, [user.role, authContext.userID]);

  // Get user data
  useEffect(() => {
    getUserData(authContext.userID);
  }, []);

  // Format listing for viewing
  useEffect(() => {
    const formattedListings = [];
    const showListings = listings.filter (listing => !reservedListings.includes(listing.listingID));
    for (let i = 0; i < showListings.length; i += 3) {
      formattedListings.push(showListings.slice(i, i + 3));
    }
    setGroupedListings(formattedListings);
  }, [listings, reservedListings])

  // Update when reserved item
  useEffect(() => {
    if (!reserved || reservingListingID === 0) {
      return;
    }

    const currentReserved = [...reservedListings, reservingListingID];
    currentReserved.push(reservingListingID);
    setReservedListings(currentReserved);

    setReservingListingID(0);
    setReserved(false);
  }, [reserved, reservingListingID])

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
          {
            isLoading ? (
              <MDBox textAlign="Center" my={2}>
                Loading Available Listings...
                <br />
                <CircularProgress />
              </MDBox>
            ) : fetchError ? (
              <MDTypography variant="h6" style={{ textAlign: 'center', margin: '1.5rem' }}>
                An error occured, please try again later.
              </MDTypography>
            ) : (
              groupedListings.length > 0 ? (
                groupedListings.map((rowListings, rowIndex) => (
                  <Grid container spacing={2} key={rowIndex}>
                    {rowListings.map((listing, index) => {
                        // Determine the button's disabled state and text
                      const isReported = isListingReported(listing.listingID);
                      const isTraining = trainingModel === listing.listingID;
                      const buttonDisabled = isReported || isTraining;
                      const buttonText = isTraining ? "Please wait" : isReported ? "Reported" : "Not Fresh";
                    
                      return (
                        <Grid item xs={4} key={listing.listingID || index}>
                          <Card style={{ margin: "8px"}}>
                            <MDBox p={2}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <MDTypography variant="h6">{listing.name}</MDTypography>
                                <MDButton
                                  variant="gradient"
                                  color="error"
                                  onClick={handleReport}
                                  disabled={buttonDisabled}
                                >
                                  {buttonText}
                                </MDButton>
                              </div>
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
                            </MDBox>
                          </Card>
                          <Dialog
                              open={openDialog}
                              onClose={handleClose}
                              aria-labelledby="alert-dialog-title"
                              aria-describedby="alert-dialog-description"
                            >
                            <DialogTitle id="alert-dialog-title">
                              {`Report ${listing.name} as not fresh?`}
                            </DialogTitle>
                            <DialogContent>
                              <DialogContentText id="alert-dialog-description">
                                Are you sure you want to report this item as not fresh? This action may result in the item being potentially removed from listings if found to be inaccurate or in violation of our freshness standards.
                              </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                              <MDButton variant="gradient" color="info" onClick={handleClose}>Close</MDButton>
                              <MDButton  variant="gradient" color="error" onClick={() => handleReportConfirmation(listing.image, listing.listingID)} autoFocus>
                                Report as not fresh
                              </MDButton>
                            </DialogActions>
                          </Dialog>
                        </Grid>
                      )
                    })}
                  </Grid>
                ))
              ) : (
                <MDTypography variant="h6" style={{ textAlign: 'center', margin: '1.5rem' }}>
                  No listings available.
                </MDTypography>
              )

            )
          }
          <MDSnackbar
            icon="info"
            title="Server Message:"
            content={messageSnackbar.message}
            dateTime="5 seconds ago"
            open={messageSnackbar.open}
            onClose={closeMessageSnackbar}
            close={closeMessageSnackbar}
          />
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
