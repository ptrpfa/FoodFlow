/**
=========================================================
* Food Flow
=========================================================
* Template used - Material Dashboard 2 React - v2.1.0
* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)
=========================================================
*/

import{ useState, useEffect, useContext } from "react";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

import DashboardLayout from "page-components/LayoutContainers/DashboardLayout";
import DashboardNavbar from "page-components/Navbars/DashboardNavbar";
import Footer from "page-components/Footer";

import { AuthContext, useUploadImageContext } from "context";
import ListingService from "services/listing-service"; 

function DonorForm() {
  const authContext = useContext(AuthContext);
  const { uploadImageId } = useUploadImageContext();
  const [uploadResponse, setUploadResponse] = useState(null);
  const [formData, setFormData] = useState({
    UserID: "", 
    Name: "",
    Datetime: "",
    ExpiryDate: "",
    Category: "",
    Description: "",
    Image: "", 
    PickUpAddressFirst: "",
    PickUpAddressSecond: "",
    PickUpAddressThird: "",
    PickUpPostalCode: "",
    PickUpStartDate: "",
    PickUpEndDate: "",
    PickUpStartTime: "",
    PickUpEndTime: "",
    ContactPhone: "",
    ContactEmail: "",
  });
    

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

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    
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
      const data = ({
        ...formData,
        UserID: authContext.userID,
        Image: uploadImageId, 
        Datetime: formattedDatetime,
        ExpiryDate: formattedExpiryDate,
        PickUpStartDate: formattedPickUpStartDate,
        PickUpEndDate: formattedPickUpEndDate,
        PickUpStartTime: formattedPickUpStartTime,
        PickUpEndTime: formattedPickUpEndTime,
      });
  
      const response = await ListingService.createListing(data);
      console.log("Listing created:", response);
  
      setUploadResponse({ valid: true, message: "Listing created successfully" });

      window.location.href = '/mylistings';
    } catch (error) {
      console.error("Error creating listing:", error);
  
      setUploadResponse({ valid: false, message: "Failed to create listing" });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div>
      <Card>
        <MDBox mx={2} mt={-3} py={3} px={2} variant="gradient" bgColor="info" borderRadius="lg" coloredShadow="info">
          <MDTypography variant="h6" color="white">
            {"(2/2)"} Details of Food item
          </MDTypography>
        </MDBox>
        {uploadResponse && (
          <div style={{ textAlign: "center", color: uploadResponse.valid ? "green" : "red" }}>
            {uploadResponse.message}
          </div>
        )}
        <form onSubmit={handleFormSubmit}>
          <MDBox px={2} pt={3} variant="gradient">
            <MDBox pt={1}>
              <TextField
                name="Name"
                label="Food Name"
                variant="outlined"
                fullWidth
                value={formData.Name}
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
                value={formData.ExpiryDate}
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
                value={formData.Category}
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
                value={formData.Description}
                onChange={handleInputChange}
                required
                sx={{ pt: 1, pb: 2 }}
              />
              <TextField
                name="PickUpAddressFirst"
                label="Pick-Up Address (Line 1)"
                variant="outlined"
                fullWidth
                value={formData.PickUpAddressFirst}
                onChange={handleInputChange}
                required
                sx={{ pt: 1, pb: 2 }}
              />
              <TextField
                name="PickUpAddressSecond"
                label="Pick-Up Address (Line 2)"
                variant="outlined"
                fullWidth
                value={formData.PickUpAddressSecond}
                onChange={handleInputChange}
                required
                sx={{ pt: 1, pb: 2 }}
              />
              <TextField
                name="PickUpAddressThird"
                label="Pick-Up Address (Line 3)"
                variant="outlined"
                fullWidth
                value={formData.PickUpAddressThird}
                onChange={handleInputChange}
                required
                sx={{ pt: 1, pb: 2 }}
              />
              <TextField
                name="PickUpPostalCode"
                label="Pick-Up Postal Code"
                variant="outlined"
                fullWidth
                value={formData.PickUpPostalCode}
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
                value={formData.PickUpStartDate}
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
                value={formData.PickUpEndDate}
                onChange={handleInputChange}
                required
                sx={{ pt: 1, pb: 2 }}
              />
              <TextField
                name="PickUpStartTime"
                label="Pick-Up Start Time"
                variant="outlined"
                type="time" 
                fullWidth
                value={formData.PickUpStartTime}
                onChange={handleInputChange}
                required
                sx={{ pt: 1, pb: 2 }}
              />
              <TextField
                name="PickUpEndTime"
                label="Pick-Up End Time"
                variant="outlined"
                type="time" 
                fullWidth
                value={formData.PickUpEndTime}
                onChange={handleInputChange}
                required
                sx={{ pt: 1, pb: 2 }}
              />
              <TextField
                name="ContactPhone"
                label="Contact Phone"
                variant="outlined"
                fullWidth
                value={formData.ContactPhone}
                onChange={handleInputChange}
                required
                sx={{ pt: 1, pb: 2 }}
              />
              <TextField
                name="ContactEmail"
                label="Contact Email"
                variant="outlined"
                fullWidth
                value={formData.ContactEmail}
                onChange={handleInputChange}
                required
                sx={{ pt: 1, pb: 2 }}
              />
            </MDBox>
          </MDBox>
          <Grid item xs={12} style={{ display: "flex", justifyContent: "flex-end", margin: "20px 20px 20px 0" }}>
            <MDButton 
              variant="gradient"
              color="info"
              type="submit"
              >
              Donate!
            </MDButton>
          </Grid>
        </form>
      </Card>
    </div>
  );
}

function Donor() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <MDTypography variant="h3">Donor's Page</MDTypography>
          </Grid>
          <Grid item xs={12}>
            <DonorForm/>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Donor;
