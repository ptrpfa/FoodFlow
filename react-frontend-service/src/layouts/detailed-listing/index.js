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
import { Link, useParams, useNavigate } from "react-router-dom";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import DashboardLayout from "page-components/LayoutContainers/DashboardLayout";
import DashboardNavbar from "page-components/Navbars/DashboardNavbar";
import Footer from "page-components/Footer";

import { AuthContext } from "context";
import AuthService from "../../services/auth-service";
import ListingService from "services/listing-service";
import AWSS3Service from "services/aws-s3-service";

function DetailedListing(onUserUpdate) {
  const { listingID } = useParams();
  const [listing, setListing] = useState(null);
  const authContext = useContext(AuthContext);
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    role: "",
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState({open: false, message: ""});

  const handleClose = () => {
    setOpenDialog(false);
  };

  const navigate = useNavigate();
  const closeDeleteSuccess = () => {
    setDeleteSuccess({open: false, message: ""});
    navigate('/mylistings');
  }

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

  const convertUint8ArrayToBlob = (uint8Array) => {
    return new Blob([uint8Array], { type: 'image/jpeg' });
  };

  const handleDeleteListing = async () => {
    setOpenDialog(true);
  }

  const handleDeleteListingConfirm = async () => {
    try {
      // Call the service function to delete the listing
      await ListingService.deleteListing({ ListingID: listing.listingID });

      // Display success message.
      setOpenDialog(false);
      setDeleteSuccess({open: true, message: "Your listing has been deleted."});
    } catch (error) {
      setDeleteSuccess({open: true, message: `Error deleting listing: ${error.message}`});
    }
  };

  useEffect(() => {
    // Fetch user data
    const getUserData = async (UserID) => {
      try {
        const response = await AuthService.getProfile({ UserID });

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

        } else {
          console.error("User data not found.");
        }
      } catch (error) {
        console.error("An error occurred while fetching user data:", error);
      }
    };
    getUserData(authContext.userID);
  }, [authContext.userID]);

  useEffect(() => {
    // Fetch listing data
    const fetchListingDetails = async () => {
      try {
        const response = await ListingService.getListing({ ListingID: listingID });
        // Fetch the image for the retrieved listing
        const imageData = await AWSS3Service.getImage({ imageId: response.image });
        const imageBlob = convertUint8ArrayToBlob(imageData.imageData);
        const imageUrl = URL.createObjectURL(imageBlob);
        // Update the listing data with the image
        const updatedListing = { ...response, image: imageUrl };
        setListing(updatedListing);
      } catch (error) {
        setFetchError(true);
        console.error('Error fetching listing details:', error);
      }
    };

    // Fetch listing data when listingID or user.role changes
    fetchListingDetails();
  }, [listingID, user.role]);


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
                {listing.status === 2 ? (
                    <MDButton
                      variant="gradient"
                      color="success"
                      disabled={true} // the button will appear disabled if status is not 1 (0 or 2)
                    >
                      Collected
                    </MDButton>
                  ) : (authContext.userID === listing?.userID.toString() ? (
                      <div>
                        <MDButton
                          variant="gradient"
                          color="light"
                          component={Link}
                          to={`/listings/${listing.listingID}/update`}
                          style={{ marginRight: '10px' }}
                        >
                          Update Listing
                        </MDButton>
                        <MDButton
                          variant="gradient"
                          color="error"
                          onClick={handleDeleteListing}
                        >
                          Delete Listing
                        </MDButton>
                      </div>
                    ) : (
                      // Listing status is available
                      listing.status === 1 ? (
                        <MDButton
                          variant="gradient"
                          color="warning"
                          onClick={handleReservation}
                        >
                          Reserve
                        </MDButton>
                      ) : (
                        <MDButton
                          variant="gradient"
                          color="warning"
                          disabled={true} // the button will appear disabled if status is not 1 (0 or 2)
                        >
                          Reserve
                        </MDButton>
                      )
                    )
                  )
                }
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
        fetchError ? (
          <div>An error has occured, please try again later</div>
        ) : (
          <div>Loading...</div>
        )
      )}
      <Dialog
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          "Delete listing?"
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this listing? This action is not reversible!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MDButton variant="gradient" color="info" onClick={handleClose}>Close</MDButton>
          <MDButton  variant="gradient" color="error" onClick={() => handleDeleteListingConfirm(listingID)} autoFocus>
            Delete
          </MDButton>
        </DialogActions>
      </Dialog>
      <Dialog
        open={deleteSuccess.open}
        onClose={closeDeleteSuccess}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Server Message
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {deleteSuccess.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MDButton variant="gradient" color="success" onClick={() => closeDeleteSuccess()} autoFocus>
            Return Home
          </MDButton>
        </DialogActions>
      </Dialog>
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
