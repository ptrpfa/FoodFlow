import React, { useState, useEffect, useContext } from 'react';
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAlert from "components/MDAlert";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { AuthContext } from 'context';
import reservationService from 'services/reservation-service';
import AuthService from "../../services/auth-service";

function Reservation() {
  const authContext = useContext(AuthContext); // Use useContext to get the user context
  const [reservations, setReservations] = useState([]);
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    role: "",
  });
  
  useEffect(() => {
    console.log('Current UserID:', authContext.userID); // Print the current UserID
    const getUserData = async () => {
      try {
        const response = await AuthService.getProfile({ UserID: authContext.userID });

        if (response) {
          setUser({
            ...user,
            firstName: response.firstName,
            lastName: response.lastName,
            role: response.role
          });
        } else {
          console.error("User data not found.");
        }
      } catch (error) {
        console.error("An error occurred while fetching user data:", error);
      }
    };

    if (authContext.userID) {
      getUserData();
    }
  }, [authContext.userID]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await reservationService.getReservationsByUserId(authContext.userID);
        setReservations(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Failed to fetch reservations:', error);
        setReservations([]);
      }
    };

    if (authContext.userID) {
      fetchReservations();
    }
  }, [authContext.userID]);

  const renderReservation = (reservation) => {
    return (
      <div key={reservation.ReservationID} style={{margin: "10px", padding: "15px", border: "1px solid #ddd", borderRadius: "4px"}}>
        <h4>Reservation ID: {reservation.ReservationID}</h4>
        <p>Date and Time: {new Date(reservation.Datetime).toLocaleString()}</p>
        <p>Remarks: {reservation.Remarks}</p>
        <p>User ID: {reservation.UserID}</p>
        <p>Listing ID: {reservation.ListingID}</p>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <MDTypography variant="h3">All my Reservations</MDTypography>
            <MDTypography variant="h6">User ID: {authContext.userID}</MDTypography>
          </Grid>
          <Grid item xs={12}>
            {reservations.length > 0 ? (
              reservations.map(renderReservation) // Render each reservation
            ) : (
              <MDTypography>No reservations found.</MDTypography>
            )}
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Reservation;
