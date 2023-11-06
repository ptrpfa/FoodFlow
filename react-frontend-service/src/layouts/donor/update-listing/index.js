import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import { AuthContext, useUploadImageContext } from "context";
import AuthService from "../../../services/auth-service";
import ListingService from "services/listing-service";
import list from "assets/theme/components/list";

function UpdateListing() {
  const { listingID } = useParams();
  const [listing, setListing] = useState({});
  const authContext = useContext(AuthContext);
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    role: "",
  });

  const [formData, setFormData] = useState({
    UserID: authContext.userID,
    ListingID: listing.listingID,
    Name: listing.name,
    Datetime: listing.dateTime,
    ExpiryDate: listing.expiryDate,
    Category: listing.category,
    Description: listing.description,
    Image: listing.image,
    PickUpAddressFirst: listing.pickUpAddressFirst,
    PickUpAddressSecond: listing.pickUpAddressSecond,
    PickUpAddressThird: listing.pickUpAddressThird,
    PickUpPostalCode: listing.pickUpPostalCode,
    PickUpStartDate: listing.pickUpStartDate,
    PickUpEndDate: listing.pickUpEndDate,
    PickUpStartTime: listing.pickUpStartTime,
    PickUpEndTime: listing.pickUpEndTime,
    ContactPhone: listing.contactPhone,
    ContactEmail: listing.contactEmail,
  });

  const moment = require('moment-timezone');

  // Function to format the date for input
  const formatDateForInput = (date, timeZone) => {
    if (!date) return "";
    const formattedDate = moment(date);

    // Apply the time zone
    if (timeZone) {
      formattedDate.tz(timeZone);
    }

    return formattedDate.format('YYYY-MM-DD');
  };

  const timeZone = 'Asia/Singapore';
  const formattedDate = formatDateForInput(listing.pickUpStartDate, timeZone);

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
        // const imageData = await AWSS3Service.getImage({ imageId: response.image });
        // const imageBlob = convertUint8ArrayToBlob(imageData.imageData);
        // const imageUrl = URL.createObjectURL(imageBlob);
        // Update the listing data with the image
        // const updatedListing = { ...response, image: imageUrl };
        setListing(response);
        console.log("original: ", response);

        setFormData({
          UserID: authContext.userID,
          ListingID: response.listingID,
          Name: response.name,
          Datetime: response.dateTime,
          ExpiryDate: response.expiryDate,
          Category: response.category,
          Description: response.description,
          Image: response.image,
          PickUpAddressFirst: response.pickUpAddressFirst,
          PickUpAddressSecond: response.pickUpAddressSecond,
          PickUpAddressThird: response.pickUpAddressThird,
          PickUpPostalCode: response.pickUpPostalCode,
          PickUpStartDate: response.pickUpStartDate,
          PickUpEndDate: response.pickUpEndDate,
          PickUpStartTime: response.pickUpStartTime,
          PickUpEndTime: response.pickUpEndTime,
          ContactPhone: response.contactPhone,
          ContactEmail: response.contactEmail,
        });
        console.log()
      } catch (error) {
        console.error('Error fetching listing details:', error);
      }
    };

    // Fetch listing data when listingID or user.role changes
    fetchListingDetails();
  }, [listingID, user.role]);

  const handleFormUpdate = async (event) => {
    event.preventDefault();
    if (!listingID) {
      console.error('Invalid listing ID.');
      return;
    }
    else {
      console.log(listingID);

      function formatTimeTo24Hours(timeString) {
        const [time, modifier] = timeString.split(" ");

        let [hours, minutes] = time.split(":");
        hours = parseInt(hours, 10);
        minutes = parseInt(minutes, 10);

        if (modifier === "PM" && hours < 12) {
          hours += 12;
        } else if (modifier === "AM" && hours === 12) {
          hours = 0;
        }

        const formattedTime = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
        return formattedTime;
      }

      const currentDate = new Date();
      const formattedDatetime = currentDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }).replace(/,/g, '').slice(0, -3);

      const ExpiryDateObject = new Date(formData.ExpiryDate);
      const formattedExpiryDate = ExpiryDateObject.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).replace(',', '');

      const PickUpStartDateObject = new Date(formData.PickUpStartDate);
      const formattedPickUpStartDate = PickUpStartDateObject.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).replace(',', '');

      const PickUpEndDateObject = new Date(formData.PickUpEndDate);
      const formattedPickUpEndDate = PickUpEndDateObject.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).replace(',', '');

      const formattedPickUpStartTime = formatTimeTo24Hours(formData.PickUpStartTime);
      const formattedPickUpEndTime = formatTimeTo24Hours(formData.PickUpEndTime);

      try {
        const data = {
          ...formData,
          listingID: listingID,
          UserID: authContext.userID,
          Datetime: formattedDatetime,
          ExpiryDate: formattedExpiryDate,
          PickUpStartDate: formattedPickUpStartDate,
          PickUpEndDate: formattedPickUpEndDate,
          // PickUpStartTime: formattedPickUpStartTime,
          // PickUpEndTime: formattedPickUpEndTime,
        };

        console.log(data);
        const response = await ListingService.updateListing(data);
        console.log("Listing updated:", response);

      } catch (error) {
        console.error("Error updating listing:", error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div>
      <Card>
        <MDBox mx={2} mt={-3} py={3} px={2} variant="gradient" bgColor="success" borderRadius="lg" coloredShadow="info">
          <MDTypography variant="h6" color="white">
            Update Food item - {listing.name}
          </MDTypography>
        </MDBox>

        <form onSubmit={handleFormUpdate}>
          <MDBox px={2} pt={3} variant="gradient">
            <MDBox pt={1}>
              <TextField
                name="Name"
                label="Name"
                variant="outlined"
                fullWidth
                value={formData.Name || listing.name}
                onChange={handleInputChange}
                required
                sx={{ pt: 1, pb: 2 }}
              />
              <TextField
                name="ExpiryDate"
                label="Expiry Date"
                variant="outlined"
                type="date"
                fullWidth
                value={formatDateForInput(formData.ExpiryDate || listing.expiryDate)}
                onChange={handleInputChange}
                required
                sx={{ pt: 1, pb: 2 }}
                shrink
              />
              <TextField
                name="Category"
                label="Category"
                variant="outlined"
                fullWidth
                value={formData.Category || listing.category}
                onChange={handleInputChange}
                required
                sx={{ pt: 1, pb: 2 }}
              />
              <TextField
                name="Description"
                label="Description"
                variant="outlined"
                multiline
                rows={4}
                fullWidth
                value={formData.Description || listing.description}
                onChange={handleInputChange}
                required
                sx={{ pt: 1, pb: 2 }}
              />
              <TextField
                name="PickUpAddressFirst"
                label="Pick-Up Address (Line 1)"
                variant="outlined"
                fullWidth
                value={formData.PickUpAddressFirst || listing.pickUpAddressFirst}
                onChange={handleInputChange}
                placeholder={listing.pickUpAddressFirst}
                required
                sx={{ pt: 1, pb: 2 }}
              />
              <TextField
                name="PickUpAddressSecond"
                label="Pick-Up Address (Line 2)"
                variant="outlined"
                fullWidth
                value={formData.PickUpAddressSecond || listing.pickUpAddressSecond}
                onChange={handleInputChange}
                required
                sx={{ pt: 1, pb: 2 }}
              />
              <TextField
                name="PickUpAddressThird"
                label="Pick-Up Address (Line 3)"
                variant="outlined"
                fullWidth
                value={formData.PickUpAddressThird || listing.pickUpAddressThird}
                onChange={handleInputChange}
                required
                sx={{ pt: 1, pb: 2 }}
              />
              <TextField
                name="PickUpPostalCode"
                label="Pick-Up Postal Code"
                variant="outlined"
                fullWidth
                value={formData.PickUpPostalCode || listing.pickUpPostalCode}
                onChange={handleInputChange}
                required
                sx={{ pt: 1, pb: 2 }}
              />
              <TextField
                name="PickUpStartDate"
                label="Pick-Up Start Date"
                variant="outlined"
                type="date"
                fullWidth
                value={formatDateForInput(formData.PickUpStartDate || listing.pickUpStartDate)}
                onChange={handleInputChange}
                required
                sx={{ pt: 1, pb: 2 }}
              />
              <TextField
                name="PickUpEndDate"
                label="Pick-Up End Date"
                variant="outlined"
                type="date"
                fullWidth
                value={formatDateForInput(formData.PickUpEndDate || listing.pickUpEndDate)}
                onChange={handleInputChange}
                required
                sx={{ pt: 1, pb: 2 }}
              />
              {/* <MDTypography variant='p' style={{ fontSize: '12px', color: '#D3D3D3' }}>Current: {listing.pickUpStartTime}</MDTypography>
              <TextField
                name="PickUpStartTime"
                label="Pick-Up Start Time"
                variant="outlined"
                type="time"
                fullWidth
                value={formatTimeTo12Hours(formData.PickUpStartTime || listing.pickUpStartTime)}
                onChange={handleInputChange}
                required
                sx={{ pt: 1, pb: 2 }}
              />

              <MDTypography variant='p' style={{ fontSize: '12px', color: '#D3D3D3' }}>Current: {listing.pickUpEndTime}</MDTypography>
              <TextField
                name="PickUpEndTime"
                label="Pick-Up End Time"
                variant="outlined"
                type="time"
                fullWidth
                value={formatTimeTo12Hours(formData.PickUpEndTime || listing.pickUpEndTime)}
                onChange={handleInputChange}
                required
                sx={{ pt: 1, pb: 2 }}
              /> */}

              <TextField
                name="ContactPhone"
                label="Contact Phone"
                variant="outlined"
                fullWidth
                value={formData.ContactPhone || listing.contactPhone}
                onChange={handleInputChange}
                required
                sx={{ pt: 1, pb: 2 }}
              />
              <TextField
                name="ContactEmail"
                label="Contact Email"
                variant="outlined"
                fullWidth
                value={formData.ContactEmail || listing.contactEmail}
                onChange={handleInputChange}
                required
                sx={{ pt: 1, pb: 2 }}
              />
            </MDBox>
          </MDBox>
          <Grid item xs={12} style={{ display: "flex", justifyContent: "flex-end", margin: "20px 14px 20px 14px" }}>
            <MDButton
              variant="gradient"
              color="success"
              type="submit"
              fullWidth
            >
              Update!
            </MDButton>
          </Grid>
        </form>
      </Card>
    </div>
  );
}


function Update() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <MDTypography variant="h3">Update Listing</MDTypography>
          </Grid>
          <Grid item xs={12}>
            <UpdateListing />
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Update;
