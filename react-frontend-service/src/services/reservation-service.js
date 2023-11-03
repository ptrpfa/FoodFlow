import axios from "axios";
import { v4 as uuidv4 } from "uuid"; 

const API_BASE_URL = "http://localhost:9900"; 

const LOCAL_STORAGE_KEY = uuidv4(); 

const reservationService = {
  makeReservation: (product_id, quantity) => {
    //Prep the payload with the uuid key 
    const newReservation = {
      uuid: LOCAL_STORAGE_KEY,
      product_id: product_id,
      quantity: quantity,
      timestamp: new Date().toISOString()
    };
  
    //Store the payload into local storage
    localStorage.setItem(LOCAL_STORAGE_KEY, newReservation);

    return axios.post(`${API_BASE_URL}/reservation/create`, {JSON.stringify(newReservation)})
      .catch(error => {
        throw error;
      });
  }
};

export default reservationService;