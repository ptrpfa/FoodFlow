class WebSocketService {
  constructor() {
    this.socket = new WebSocket('ws://localhost:8282');
    
    this.socket.onopen = () => {
      console.log('WebSocket connection is open');
    };
    
    this.socket.onclose = () => {
      console.log('WebSocket connection is closed');
    };

    this.socket.onmessage = (event) => {

      const server_message = (event.data).toString();
      const reservationMessage = JSON.parse(server_message);
      console.log(reservationMessage);
      const payload = '';
      
      //Get from localstorage   
      const msg_id  = reservationMessage.msg_id;
      const convo = localStorage.getItem(msg_id);
      const sender = reservationMessage.sender;
     
      if(convo != null){
        const convo_dict = JSON.parse(convo);
        if(!convo_dict.replies.includes(sender)){
          convo_dict.replies.push(sender);

          if (reservation.replies.length === 2) {
            // Mark the conversation as successful
            console.log(`Conversation with msg_id ${reservation.msg_id} is successful.`);
            payload="Reservation Received";
          }
        }
      }

      // Call the onmessage callback if it is defined
      if (this.onmessage) {
      // const reservationMessage = JSON.parse(event.data); 
      // const message = reservationMessage.payload;
      // console.log('Received message:', message);
      
      // // Call the onmessage callback if it is defined
      // if (this.onmessage) {
      //   this.onmessage(message, false); // Assuming it's not binary
      // }
        this.onmessage(reservationMessage.payload, false); // Assuming it's not binary
      }

    };
  }

  setReservationFailedTimer(msg_id) {
    const timeout = 5000; // 5000 milliseconds (5 seconds) as an example, adjust as needed
    setTimeout(() => {
      const convo = localStorage.getItem(msg_id);
      if (convo != null) {
        const convo_dict = JSON.parse(convo);
        if (convo_dict.replies.length < 2) {
          this.onReservationFailed(msg_id);
        }
      }
    }, timeout);
  }

  markConversationAsSuccessful(msg_id) {
    console.log(`Conversation with msg_id ${msg_id} is successful.`);
  }

  onReservationFailed(msg_id) {
    // This function will be called when a reservation fails
    console.log(`Reservation with msg_id ${msg_id} failed.`);
  }
}

export default WebSocketService;
