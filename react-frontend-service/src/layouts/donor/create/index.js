import{ useState, useEffect, useContext } from "react";

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
import ListingService from "services/listing-service"; 

function DonorForm() {
  const authContext = useContext(AuthContext);
  const [uploadResponse, setUploadResponse] = useState(null);
  const { uploadImageId } = useUploadImageContext();
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
    
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const currentDate = new Date();
    const formattedDatetime = currentDate.toISOString();
    const formattedExpiryDate = new Date(formData.ExpiryDate).toISOString();
    const formattedPickUpStartDate = new Date(formData.PickUpStartDate).toISOString();
    const formattedPickUpEndDate = new Date(formData.PickUpEndDate).toISOString();
    const formattedPickUpStartTime = new Date(`1970-01-01T${formData.PickUpStartTime}`).toISOString();
    const formattedPickUpEndTime = new Date(`1970-01-01T${formData.PickUpEndTime}`).toISOString();
  
    try {
      const data = JSON.stringify({
        ...formData,
        Image: uploadImageId,
        UserID: authContext.userID,
        Datetime: formattedDatetime,
        ExpiryDate: formattedExpiryDate,
        PickUpStartDate: formattedPickUpStartDate,
        PickUpEndDate: formattedPickUpEndDate,
        PickUpStartTime: formattedPickUpStartTime,
        PickUpEndTime: formattedPickUpEndTime,
      });
  
      console.log("Listing in JSON:", data);
  
      const response = await ListingService.createListing(data);
      console.log("Listing created:", response);
  
      setUploadResponse({ valid: true, message: "Listing created successfully" });
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
            <MDButton variant="gradient" color="info" type="submit">
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
