import axios from "axios";
import { v4 as uuidv4 } from "uuid"; 

const API_BASE_URL = "http://localhost:9900"; 

//adrian's code
// const reservationService = {
//   makeReservation: (product_id, quantity) => {
//     //Prep the payload with the uuid key 
//     const newReservation = {
//       uuid: LOCAL_STORAGE_KEY,
//       product_id: product_id,
//       quantity: quantity,
//       timestamp: new Date().toISOString()
//     };

//     //Store the payload into local storage
//     localStorage.setItem(LOCAL_STORAGE_KEY, newReservation);

//     return axios.post(`${API_BASE_URL}/reservation/create`, {JSON.stringify(newReservation)})
//       .catch(error => {
//         throw error;
//       });
//   }
// };

const checkLocalStorage = (msg_id) => {
  const reservationData = JSON.parse(localStorage.getItem(msg_id));

  if (reservationData) {
    // Data is found in local storage, so return the data
    var payload = "Reservation is successful";
    Promise.resolve(payload);
  }else{
     // Data is found in local storage, so return the data
     var payload = "Reservation is unsuccessfull";
    Promise.resolve(payload);
  }
};

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
      
    // Set up a timer to check local storage after 5 seconds
    const checkLocalStorageInterval = setInterval(() => {
      checkLocalStorage(LOCAL_STORAGE_KEY).then(payload => {
        console.log(payload);
        // Data found in local storage, clear the interval
        clearInterval(checkLocalStorageInterval);
        if (payload) {
          // Data is available, resolve the main promise with the data
          return(payload);
        }
      });
    }, 5000);

    return new Promise((resolve, reject) => {
      axios
        .post(`${API_BASE_URL}/reservation/create`, newReservation, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then(response => {
          // Reservation data received, clear the interval
          clearInterval(checkLocalStorageInterval);
          resolve(response.data);
        })
        .catch(error => {
          // Handle the error here
          clearInterval(checkLocalStorageInterval);
          resolve(error);
        });
    });

  },
  deleteReservation: (ReservationID) => {
    return axios.delete(`${API_BASE_URL}/reservation/delete/${ReservationID}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        resolve(error);
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
