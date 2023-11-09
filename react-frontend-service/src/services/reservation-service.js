import axios from "axios";

const API_BASE_URL = "http://localhost:9900"; 


const reservationService = {
  
  makeReservation: (UserID,ListingID, msg_id) => {

    //Prep the payload with the uuid key 
    const newReservation = {
      msg_id: msg_id,
      UserID: UserID,
      ListingID: ListingID,
      replies: []
    };

    //Store the payload into local storage
    localStorage.setItem(msg_id, JSON.stringify(newReservation));
      
    return new Promise((resolve, reject) => {
      axios
        .post(`${API_BASE_URL}/reservation/create`, newReservation, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then(response => {
          const msg_id = response.data.msg_id;
          const convo = localStorage.getItem(msg_id);
          const sender = response.data.sender;

          if(convo != null){
            // Reply is for this client
            const convo_dict = JSON.parse(convo);
            if(!convo_dict.replies.includes(sender)){
              convo_dict.replies.push(sender);
              localStorage.setItem(msg_id, JSON.stringify(convo_dict));
      
              // Check in the event database has already sent back the success message
              if (convo_dict.replies.length === 2) {
                // Mark the conversation as successful
                console.log(`Conversation with msg_id ${reservation.msg_id} is successful.`);
    
                // Remove from localstorage
                localStorage.removeItem(msg_id);

                resolve(response.data.message);
              }
            }
          }
        })
        .catch(error => {
            const msg_id = error.msg_id;
            const convo = localStorage.getItem(msg_id);
            
            if(convo != null){
              // Server url error
              console.error("Reservation failed:", error);
              // Remove the reservation request from localstorage
              localStorage.removeItem(msg_id);
              
              resolve(error.message);
            }
        });
    });
  },

  deleteReservation: (ReservationID, msg_id) => {
    // const LOCAL_STORAGE_KEY = uuidv4(); 
    
    const payload = {
      ReservationID: ReservationID,
      msg_id: msg_id,
      replies: []
    };
    
    localStorage.setItem(msg_id, JSON.stringify(payload));

    return new Promise((resolve, reject) => {
    axios
      .delete(`${API_BASE_URL}/reservation/delete/${ReservationID}`, payload,  {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        const msg_id = response.data.msg_id;
        const convo = localStorage.getItem(msg_id);
        const sender = response.data.sender;
        if(convo != null){
          // Reply is for this client
          const convo_dict = JSON.parse(convo);
          if(!convo_dict.replies.includes(sender)){
            convo_dict.replies.push(sender);
            localStorage.setItem(msg_id, JSON.stringify(convo_dict));
    
            // Check in the event database has already sent back the success message
            if (convo_dict.replies.length === 2) {
              // Mark the conversation as successful
              console.log(`Conversation with msg_id ${reservation.msg_id} is successful.`);
  
              // Remove from localstorage
              localStorage.removeItem(msg_id);

              resolve(response.data);
            }
          }
        }
      })
      .catch(error => {
          const msg_id = error.msg_id;
          const convo = localStorage.getItem(msg_id);
          
          if(convo != null){
            // Server url error
            console.error("Reservation failed:", error);
            // Remove the reservation request from localstorage
            localStorage.removeItem(msg_id);
            
            resolve(error.message);
          }
      });
    })
  },

  getReservationsByUserId: (UserID, msg_id) => {
    // No need to create an object, just pass UserID in the URL
    // const LOCAL_STORAGE_KEY = uuidv4(); 

    const payload = {
      UserID: UserID,
      msg_id: msg_id,
      replies: []
    };

    localStorage.setItem(msg_id, JSON.stringify(payload));
    
    return new Promise((resolve, reject) => {
      axios
        .get(`${API_BASE_URL}/reservation/${UserID}`, {
          headers: {
            'Content-Type': 'application/json'
          },
          params: {
            msg_id: msg_id // Send msg_id
          }
        })
      .then(response => {
        const msg_id = response.data.msg_id;
        const convo = localStorage.getItem(msg_id);
        const sender = response.data.sender;
        if(convo != null){
          // Reply is for this client
          const convo_dict = JSON.parse(convo);
          if(!convo_dict.replies.includes(sender)){
            convo_dict.replies.push(sender);
            localStorage.setItem(msg_id, JSON.stringify(convo_dict));
    
            // Check in the event database has already sent back the success message
            if (convo_dict.replies.length === 2) {
              // Mark the conversation as successful
              console.log(`Conversation with msg_id ${reservation.msg_id} is successful.`);
  
              // Remove from localstorage
              localStorage.removeItem(msg_id);

              resolve(response.data);
            }
          }
        }
      }) 
      //return response
      .catch(error => {
        const msg_id = error.msg_id;
        const convo = localStorage.getItem(msg_id);
        
        if(convo != null){
          // Server url error
          console.error("Reservation failed:", error);
          // Remove the reservation request from localstorage
          localStorage.removeItem(msg_id);
          
          resolve(error.message);
        }
      });
    })
  }
  
}

export default reservationService;
