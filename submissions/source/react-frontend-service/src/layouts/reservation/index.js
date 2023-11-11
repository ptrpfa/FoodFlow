/**
=========================================================
* Food Flow
=========================================================
* Template used - Material Dashboard 2 React - v2.1.0
* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)
=========================================================
*/

import React, { useState, useEffect, useContext } from 'react';
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAlert from "components/MDAlert";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";
import DashboardLayout from "page-components/LayoutContainers/DashboardLayout";
import DashboardNavbar from "page-components/Navbars/DashboardNavbar";
import Footer from "page-components/Footer";
import { AuthContext } from 'context';
import reservationService from 'services/reservation-service';
import AuthService from "../../services/auth-service";
import WebSocketService from "services/web-listener";


function Reservation() {
  const authContext = useContext(AuthContext); 
  const [reservations, setReservations] = useState([]);
  const [message, setMessage] = useState(''); 
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    role: "",
  });

  const handleReservation = (ReservationID) => {
    reservationService.deleteReservation(ReservationID)
      .then(response => {
        setMessage(response.data.message); // Set the success message from the response
        // Filter out the canceled reservation
        setReservations(reservations.filter(reservation => reservation.ReservationID !== ReservationID));
      })
      .catch(error => {
        console.error("Delete failed:", error);
        setMessage("Delete failed"); // Set the error message
      });
  };

  const [deleteSnackbar, setDeleteSnackbar] = useState({ open: false, message: "" });
  const closeDeleteSnackbar = () => {
    setDeleteSnackbar({ open: false, message: "" });
  };
  

  
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

  useEffect(() => {
    const webSocket = new WebSocket('ws://localhost:8282');

    webSocket.onopen = () => {
      console.log('WebSocket for Get Reservation is Connected');
    };

    webSocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'RESERVATION_DATA') {
        setReservations(message.data);
      }
    };

    webSocket.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    return () => {
      webSocket.close();
    };
  }, []); 

  useEffect(() => {
    const webSocket = new WebSocket('ws://localhost:8282');
  
    webSocket.onopen = () => {
      console.log('WebSocket for Delete Reservation is Connected');
    };
  
    webSocket.webmessage = (event) => {
      const data = JSON.parse(event.data);
  
      // Check if the message is a delete confirmation
      if (data.status === 200 && data.action === 'delete') {
        setDeleteSnackbar({ open: true, message: "Reservation deleted successfully" });
        // Also remove the reservation from the list
        setReservations(currentReservations => 
          currentReservations.filter(reservation => reservation.ReservationID.toString() !== data.msg_id)
        );
      } else if (data.status === 500 && data.action === 'delete') {
        setDeleteSnackbar({ open: true, message: data.payload });
      }
    };
  
    webSocket.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };
  
    return () => {
      webSocket.close();
    };
  }, []);

  const renderDeleteSnackbar = (
    <MDSnackbar
      icon="info"
      title="Server Message:"
      content={deleteSnackbar.message}
      dateTime="5 seconds ago"
      open={deleteSnackbar.open}
      onClose={closeDeleteSnackbar}
      close={closeDeleteSnackbar}
      autoHideDuration={6000} 
    />
  );

  const renderReservation = (reservation) => (
    <div key={reservation.ReservationID} style={{ margin: "10px", padding: "15px", border: "1px solid #ddd", borderRadius: "4px" }}>
      <h4>Reservation ID: {reservation.ReservationID}</h4>
      <p>Date and Time: {new Date(reservation.Datetime).toLocaleString()}</p>
      <p>Remarks: {reservation.Remarks}</p>
      <p>User ID: {reservation.UserID}</p>
      <p>Listing ID: {reservation.ListingID}</p>
      <MDButton
        variant="gradient"
        color="error"
        onClick={() => handleReservation(reservation.ReservationID)}
        fullWidth
      >
        Cancel
      </MDButton>
    </div>
  );
  
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
            {reservations.length > 0 ? reservations.map(renderReservation) : <MDTypography>No reservations found.</MDTypography>}
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
      {renderDeleteSnackbar}
    </DashboardLayout>
  );
}

export default Reservation;
