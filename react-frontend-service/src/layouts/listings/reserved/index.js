/**
=========================================================
* Food Flow
=========================================================
* Template used - Material Dashboard 2 React - v2.1.0
* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)
=========================================================
*/

import { useState, useEffect, useContext, useMemo, useRef } from "react";
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
import { v4 as uuidv4 } from "uuid"; 

import { AuthContext } from "context";
import AuthService from "../../../services/auth-service";
import reservationService from "services/reservation-service";
import AWSS3Service from "services/aws-s3-service";
import ListingService from "services/listing-service";
import WebSocketService from "services/web-listener";
import { startInterval } from "services/interval";

function FoodListingsTable({ onUserUpdate }) {
  const authContext = useContext(AuthContext);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [receivedReply, setReceivedReply] = useState(false);
  const [listings, setListings] = useState([]);
  const [groupedListings, setGroupedListings] = useState([]);
  const [deletedListings, setDeletedListings] = useState([]);
  const [listingsWithImages, setListingsWithImages] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [deleteSnackbar, setDeleteSnackbar] = useState({ open: false, message: "" });
  const [openDialog, setOpenDialog] = useState(false);
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    role: "",
  });
  const webSocketService = useMemo(() => new WebSocketService(), []);

  const checkLocalStorageIntervalGet = useRef(null);
  const checkLocalStorageIntervalDelete = useRef(null);

  // Open dialog
  const deleteReservation = () => {
    setOpenDialog(true);
  };

  // Close dialog
  const handleClose = () => {
    setOpenDialog(false);
  };

  const closeMessageSnackbar = () => {
    setDeleteSnackbar({ open: false, message: "" });
  }

  // Delete the reservation
  const handleDeleteConfirmation = (ReservationID, listingID) => {
    const LOCAL_STORAGE_KEY = uuidv4(); 

    // Start the timer
    const {promise, intervalId} = startInterval(LOCAL_STORAGE_KEY);
    checkLocalStorageIntervalDelete.current = intervalId;
    setOpenDialog(false);
    reservationService.deleteReservation(ReservationID)
      .then(data => {
        clearInterval(checkLocalStorageIntervalDelete.current);
        if(data) {
          // const currentDeleted = [...deletedListings, listingID];
          // currentDeleted.push(listingID);
          // setDeletedListings(currentDeleted);
          // console.log(currentDeleted);
          // setMessage(data.message);
        }
      })
      .catch(error => {
        console.error("Delete failed:", error);
        setMessage("Delete failed");
      });
    
    promise.then(data => {
      
      if(data){
        setMessageSnackbar({ open: true, message: data });
      }
    });
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
        console.error("User data not found.");
      }
    } catch (error) {
      console.error("An error occurred while fetching user data:", error);
    }
  };

  // Converts s3 return value to blob
  const convertUint8ArrayToBlob = (uint8Array) => {
    return new Blob([uint8Array], { type: 'image/jpeg' });
  };

  // Clean up socket
  function socketCleanup(){
    if (webSocketService.socket && webSocketService.socket.readyState === WebSocket.OPEN) {
      webSocketService.socket.close();
    }
    clearInterval(checkLocalStorageIntervalDelete.current);
    clearInterval(checkLocalStorageIntervalGet.current);
  }

  // Set up web socket
  useEffect(() => {
    async function handleMessage(message) {
      console.log("message");
      console.log(message);
      // GET
      if (message.action === 'get') {
        clearInterval(checkLocalStorageIntervalGet.current);
        const listingDetails = await Promise.all(
          message.data.map(reservation =>
            ListingService.getListing({ ListingID: reservation.ListingID })
              .then(listingDetails => ({ ...listingDetails, reservationID: reservation.ReservationID }))
          )
        );
        console.log("listingDetails");
        console.log(listingDetails);
        setListings(listingDetails);
        setReceivedReply(true);
      }
      // DELETE
      // Check if the message is a delete confirmation
      if (message.action === 'delete') {
        clearInterval(checkLocalStorageIntervalDelete.current);
        setDeleteSnackbar({ open: true, message: "Reservation deleted successfully" });
        // Also remove the reservation from the list
        setListingsWithImages(listingsWithImages => 
          listingsWithImages.filter(listing => listing.ListingID !== message.listingID)
        );
        const currentDeleted = [...deletedListings,  message.listingID];
        currentDeleted.push(message.listingID);
        setDeletedListings(currentDeleted);
      } else if (message.status === 500 && message.action === 'delete') {
        setDeleteSnackbar({ open: true, message: message.payload });
      }
    }

    async function connectWebSocket() {
      setIsLoading(true);
      webSocketService.setMessageHandler(handleMessage);
      await webSocketService.setupWebSocket();
      setSocketConnected(true);
    }
    
    connectWebSocket();
    return () => {
      // Cleanup function
      socketCleanup();
    }
  }, []);

  // Get reservation data by user id
  useEffect(() => {
    if (!socketConnected) {
      return; // If socket is not connected, exit the effect early
    }

    const fetchReservations = async () => {
      const LOCAL_STORAGE_KEY = uuidv4(); 
      const {promise, intervalId} = startInterval(LOCAL_STORAGE_KEY);
      // Start the timer
      checkLocalStorageIntervalGet.current = intervalId;
      console.log("fetching listings");
      reservationService.getReservationsByUserId(authContext.userID, LOCAL_STORAGE_KEY)
        .then(data => {
          if(data){
              console.log(`data: ${data}`);
          }
        });
    
      promise.then(data => {
        if(data){
          console.log(`promise data: ${data}`);
        }
      });
    }

    if (authContext.userID) {
      fetchReservations();
    }
  },[socketConnected])

  // Get user data
  useEffect(() => {
    getUserData(authContext.userID);
  }, []);



  // Fetch listing details based on reservation details
  useEffect(() => {
    if (!socketConnected && !receivedReply) {
      return; // If socket is not connected, exit the effect early
    }
    
    const fetchImage = async (listing) => {
      const imageData = await AWSS3Service.getImage({ imageId: listing.image });
      const imageBlob = convertUint8ArrayToBlob(imageData.imageData);
      const imageUrl = URL.createObjectURL(imageBlob);
      return { ...listing, image: imageUrl };
    };

    const fetchListingWithImages = async () => {
      try {
        const formattedListings = await Promise.all(
          listings.map(listing => fetchImage(listing))
        );
      console.log("formattedListings");
      console.log(formattedListings);

      setListingsWithImages(formattedListings);
    } catch (error) {
        console.error('Failed to fetch reservations:', error);
        setListingsWithImages([]);
      }
    };

    if (authContext.userID) {
      fetchListingWithImages();
    }
  }, [socketConnected,  authContext.userID, listings, receivedReply]);

  // Format listing for viewing
  useEffect(() => {
    if (!receivedReply) {
      return;
    }
    const formattedListings = [];
    const showListings = listingsWithImages.filter (listing => !deletedListings.includes(listing.listingID));
    for (let i = 0; i < showListings.length; i += 3) {
      formattedListings.push(showListings.slice(i, i + 3));
    }
    setGroupedListings(formattedListings);
    setIsLoading(false);
  }, [listingsWithImages, deletedListings])  

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
            Reserved Donated Food
          </MDTypography>
        </MDBox>
        <MDBox pt={3}>
          {
            isLoading ? (
              <MDBox textAlign="Center" my={2}>
                Loading Your Reserved Listings...
                <br />
                <CircularProgress />
              </MDBox>
            ) : (
              groupedListings.length > 0 ? (
                groupedListings.map((rowListings, rowIndex) => (
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
                            {}
                            <MDButton
                              variant="gradient"
                              color="error"
                              onClick={() => deleteReservation()}
                              fullWidth
                            >
                              Cancel
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
                            {`Cancel Reservation?`}
                          </DialogTitle>
                          <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                              Are you sure you want to cancel this reservation? This action is not reversible!
                            </DialogContentText>
                          </DialogContent>
                          <DialogActions>
                            <MDButton variant="gradient" color="info" onClick={handleClose}>Close</MDButton>
                            <MDButton  variant="gradient" color="error" onClick={() => handleDeleteConfirmation(listing.reservationID, listing.listingID)} autoFocus>
                              Cancel
                            </MDButton>
                          </DialogActions>
                        </Dialog>
                      </Grid>
                    ))
                  }
                </Grid>
              ))) : (
                <MDTypography variant="h6" style={{ textAlign: 'center', margin: '1.5rem' }}>
                  No listings available.
                </MDTypography>
              )
            )
          }
          <MDSnackbar
            icon="info"
            title="Server Message:"
            content={deleteSnackbar.message}
            dateTime="5 seconds ago"
            open={deleteSnackbar.open}
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
