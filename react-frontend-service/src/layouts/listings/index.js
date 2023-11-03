import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import ListingService from "services/listing-service"; 
import AWSS3Service from "services/aws-s3-service";
import reservationService from "services/reservation-service";

import WebSocketService from "services/web-listener.js";


function FoodListingsTable() {
  const [infoSB, setInfoSB] = useState(false);
  const [listings, setListings] = useState([]);

  const openInfoSB = () => setInfoSB(true);
  const closeInfoSB = () => setInfoSB(false);

  const renderInfoSB = (
    <MDSnackbar
      icon="info"
      title="Ni mama hen mei"
      content="This will be linked to Ryan's view listing details"
      dateTime="5 seconds ago"
      open={infoSB}
      onClose={closeInfoSB}
      close={closeInfoSB}
    />
  );

  useEffect(() => {
    const fetchImageForListing = async (listing) => {
      const imageData = await AWSS3Service.getImage({ imageId: listing.image });
      const imageBlob = convertUint8ArrayToBlob(imageData.imageData);
      const imageUrl = URL.createObjectURL(imageBlob);
      return { ...listing, image: imageUrl };
    };
  
    ListingService.getAllListing()
      .then(async (allListings) => {
        const listingsWithImages = await Promise.all(
          allListings.map(fetchImageForListing)
        );
        setListings(listingsWithImages);
      })
      .catch((error) => {
        console.error("Error fetching listings:", error);
      });
  }, []);

  const convertUint8ArrayToBlob = (uint8Array) => {
    return new Blob([uint8Array], { type: 'image/jpeg' });
  };

  const groupedListings = [];
  
  for (let i = 0; i < listings.length; i += 3) {
    groupedListings.push(listings.slice(i, i + 3));
  }

  // const [message, setMessage] = useState("");
  const handleReservation = () => {

    reservationService.makeReservation(product_id, quantity)
      // .then(data => {
      //   setMessage(data.message);
      // })
      .catch(error => {
        console.error("Reservation failed:", error);
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

    //Check if message is for the client 
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
        <MDBox pt={7}>
          {groupedListings.map((rowListings, rowIndex) => (
            <Grid container spacing={8} key={rowIndex}>
              {rowListings.map((listing, index) => (
                <Grid item xs={4} key={index}>
                  <Card style={{ margin: "8px"}}>
                      <MDBox p={9}>
                        <MDBox
                        mx={3}
                        mt={-13}
                        mb={3}
                        ml={0}
                        mr={0}
                        py={1}
                        px={4}
                        variant="gradient"
                        borderRadius="lg"
                        coloredShadow="info"
                        >
                        <img 
                          src={listing.image}
                          style={{  width: "100%", height: "100%" }}
                          alt={listing.name}
                        />
                      </MDBox>
                      <MDTypography variant="h5">{listing.name}</MDTypography>
                      
                      <MDTypography>{listing.description}</MDTypography>
                      <MDButton
                        variant="gradient"
                        color="info"
                        onClick={openInfoSB}
                        size="medium"
                      >
                        View Item
                      </MDButton>
                      <MDButton
                        variant="gradient"
                        color="info"
                        onClick={handleReservation}
                      >
                        Reserve
                      </MDButton>
                      {renderInfoSB}
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

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <MDTypography variant="h3">Donor's Listings</MDTypography>
              <Link to="/donor">
                <MDButton variant="gradient" color="info">
                  Donate Food
                </MDButton>
              </Link>
            </div>
          </Grid>
          <Grid item xs={12}>
            <FoodListingsTable />
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Listings;
