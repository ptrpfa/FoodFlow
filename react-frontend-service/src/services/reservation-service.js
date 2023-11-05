import axios from "axios";
import { v4 as uuidv4 } from "uuid"; 

const API_BASE_URL = "http://localhost:9900"; 

const reservationService = {
  makeReservation: (UserID,ListingID) => {
    const LOCAL_STORAGE_KEY = uuidv4(); 
    //Prep the payload with the uuid key 
    const newReservation = {
      msg_id: LOCAL_STORAGE_KEY,
      UserID: UserID,
      ListingID: ListingID,
      replies: []
    };
  
    //Store the payload into local storage
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newReservation));

    return axios.post(`${API_BASE_URL}/reservation/create`, newReservation, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        console.log(response.data.message); 
      })
      .catch(error => {
        throw error;
      });
  },
  deleteReservation: (ReservationID) => {
    const deleteReservation = {
      ReservationID: ReservationID,
    };
    return axios.delete(`${API_BASE_URL}/reservation/delete`, deleteReservation, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        console.log(response.data.message); 
      })
      .catch(error => {
        throw error;
      });
  },
  getReservationsByUserId: (UserID) => {
    // No need to create an object, just pass UserID in the URL
    return axios.get(`${API_BASE_URL}/reservation/${UserID}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.data) // Return the data directly
    //return response
    .catch(error => {
      throw error;
    });
  }
}

export default reservationService;
