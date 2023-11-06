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

import { AuthContext } from "context";
import AuthService from "../../../services/auth-service";
import ListingService from "services/listing-service";

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
    listingID: listing.listingID,
    name: listing.name,
    datetime: listing.dateTime,
    expirydate: listing.expiryDate,
    category: listing.category,
    description: listing.description,
    pickupaddressfirst: listing.pickUpAddressFirst,
    pickupaddresssecond: listing.pickUpAddressSecond,
    pickupaddressthird: listing.pickUpAddressThird,
    pickuppostalcode: listing.pickUpPostalCode,
    pickupstartdate: listing.pickUpStartDate,
    pickupenddate: listing.pickUpEndDate,
    pickupstarttime: listing.pickUpStartTime,
    pickupendtime: listing.pickUpEndTime,
    contactphone: listing.contactPhone,
    contactemail: listing.contactEmail,
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
        setListing(response);

        setFormData({
          listingID: response.listingID,
          name: response.name,
          datetime: response.dateTime,
          expirydate: response.expiryDate,
          category: response.category,
          description: response.description,
          pickupaddressfirst: response.pickUpAddressFirst,
          pickupaddresssecond: response.pickUpAddressSecond,
          pickupaddressthird: response.pickUpAddressThird,
          pickuppostalcode: response.pickUpPostalCode,
          pickupstartdate: response.pickUpStartDate,
          pickupenddate: response.pickUpEndDate,
          pickupstarttime: response.pickUpStartTime,
          pickupendtime: response.pickUpEndTime,
          contactphone: response.contactPhone,
          contactemail: response.contactEmail,
        });
      } catch (error) {
        console.error('Error fetching listing details:', error);
      }
    };

    // Fetch listing data when listingID or user.role changes
    fetchListingDetails();
  }, [listingID, user.role]);

  function formatTimeTo24Hours(timeString) {
    if (!timeString) {
      return "";
    }
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

  const handleFormUpdate = async (event) => {
    event.preventDefault();
    if (!listingID) {
      console.error('Invalid listing ID.');
      return;
    }
    else {
      const currentDate = new Date();
      const formattedDatetime = currentDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }).replace(/,/g, '').slice(0, -3);

      const ExpiryDateObject = new Date(formData.expirydate);
      const formattedExpiryDate = ExpiryDateObject.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).replace(',', '');

      const PickUpStartDateObject = new Date(formData.pickupstartdate);
      const formattedPickUpStartDate = PickUpStartDateObject.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).replace(',', '');

      const PickUpEndDateObject = new Date(formData.pickupenddate);
      const formattedPickUpEndDate = PickUpEndDateObject.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).replace(',', '');

      const formattedPickUpStartTime = formatTimeTo24Hours(formData.pickupstarttime);
      const formattedPickUpEndTime = formatTimeTo24Hours(formData.pickupendtime);

      try {
        const data = {
          ...formData,
          datetime: formattedDatetime,
          expirydate: formattedExpiryDate,
          pickupstartdate: formattedPickUpStartDate,
          pickupenddate: formattedPickUpEndDate,
          pickupstarttime: formattedPickUpStartTime,
          pickupendtime: formattedPickUpEndTime,
        };

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
                name="name"
                label="Name"
                variant="outlined"
                fullWidth
                value={formData.name || listing.name}
                onChange={handleInputChange}
                required
                sx={{ pt: 1, pb: 2 }}
              />
              <TextField
                name="expirydate"
                label="Expiry Date"
                variant="outlined"
                type="date"
                fullWidth
                value={formatDateForInput(formData.expirydate || listing.expiryDate)}
                onChange={handleInputChange}
                required
                sx={{ pt: 1, pb: 2 }}
                shrink
              />
              <TextField
                name="category"
                label="Category"
                variant="outlined"
                fullWidth
                value={formData.category || listing.category}
                onChange={handleInputChange}
                required
                sx={{ pt: 1, pb: 2 }}
              />
              <TextField
                name="description"
                label="Description"
                variant="outlined"
                multiline
                rows={4}
                fullWidth
                value={formData.description || listing.description}
                onChange={handleInputChange}
                required
                sx={{ pt: 1, pb: 2 }}
              />
              <TextField
                name="pickupaddressfirst"
                label="Pick-Up Address (Line 1)"
                variant="outlined"
                fullWidth
                value={formData.pickupaddressfirst || listing.pickUpAddressFirst}
                onChange={handleInputChange}
                placeholder={listing.pickUpAddressFirst}
                required
                sx={{ pt: 1, pb: 2 }}
              />
              <TextField
                name="pickupaddresssecond"
                label="Pick-Up Address (Line 2)"
                variant="outlined"
                fullWidth
                value={formData.pickupaddresssecond || listing.pickUpAddressSecond}
                onChange={handleInputChange}
                required
                sx={{ pt: 1, pb: 2 }}
              />
              <TextField
                name="pickupaddressthird"
                label="Pick-Up Address (Line 3)"
                variant="outlined"
                fullWidth
                value={formData.pickupaddressthird || listing.pickUpAddressThird}
                onChange={handleInputChange}
                required
                sx={{ pt: 1, pb: 2 }}
              />
              <TextField
                name="pickuppostalcode"
                label="Pick-Up Postal Code"
                variant="outlined"
                fullWidth
                value={formData.pickuppostalcode || listing.pickUpPostalCode}
                onChange={handleInputChange}
                required
                sx={{ pt: 1, pb: 2 }}
              />
              <TextField
                name="pickupstartdate"
                label="Pick-Up Start Date"
                variant="outlined"
                type="date"
                fullWidth
                value={formatDateForInput(formData.pickupstartdate || listing.pickUpStartDate)}
                onChange={handleInputChange}
                required
                sx={{ pt: 1, pb: 2 }}
              />
              <TextField
                name="pickupenddate"
                label="Pick-Up End Date"
                variant="outlined"
                type="date"
                fullWidth
                value={formatDateForInput(formData.pickupenddate || listing.pickUpEndDate)}
                onChange={handleInputChange}
                required
                sx={{ pt: 1, pb: 2 }}
              />
              <TextField
                name="pickupstarttime"
                label="Pick-Up Start Time"
                variant="outlined"
                type="time"
                fullWidth
                value={formatTimeTo24Hours(formData.pickupstarttime || listing.pickUpStartTime)}
                onChange={handleInputChange}
                required
                sx={{ pt: 1, pb: 2 }}
              />

              <TextField
                name="pickupendtime"
                label="Pick-Up End Time"
                variant="outlined"
                type="time"
                fullWidth
                value={formatTimeTo24Hours(formData.pickupendtime || listing.pickUpEndTime)}
                onChange={handleInputChange}
                required
                sx={{ pt: 1, pb: 2 }}
              />

              <TextField
                name="contactphone"
                label="Contact Phone"
                variant="outlined"
                fullWidth
                value={formData.contactphone || listing.contactPhone}
                onChange={handleInputChange}
                required
                sx={{ pt: 1, pb: 2 }}
              />
              <TextField
                name="contactemail"
                label="Contact Email"
                variant="outlined"
                fullWidth
                value={formData.contactemail || listing.contactEmail}
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
