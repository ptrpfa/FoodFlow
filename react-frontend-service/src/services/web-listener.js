class WebSocketService {

  constructor() {
    this.socket = null;
    this.socketOpenPromise = null;
    this.onmessage = null;
  }

  setMessageHandler(handler) {
    this.onmessage = handler; 
  }

  async setupWebSocket() {
    if (this.socket && this.socket.readyState < WebSocket.CLOSING) {
      console.log('WebSocket is already open or opening');
      return;
    }

    this.socket = new WebSocket('ws://localhost:8282');

    this.socketOpenPromise = new Promise((resolve) => {
      this.socket.onopen = () => {
        console.log('WebSocket connection is open');
        this.socket.onmessage = (event) => {
          console.log("Socket received message");
          console.log(event);
          const server_message = (event.data).toString();
          const reservationMessage = JSON.parse(server_message);
          var payload = '';
          
          if (this.onmessage) {
            //Get from localstorage   
            const msg_id  = reservationMessage.msg_id;
            const convo = localStorage.getItem(msg_id);
            const sender = reservationMessage.sender;
    
            if (convo != null) { // Message for the client
              const status = reservationMessage.status;
              if (status == 200) {
                const convo_dict = JSON.parse(convo);
                if (!convo_dict.replies.includes(sender)) {
                  convo_dict.replies.push(sender);
                }
    
                localStorage.setItem(msg_id, JSON.stringify(convo_dict));
                if (convo_dict.replies.length === 2) {
                  // Mark the conversation as successful
                  console.log(`Conversation with msg_id ${msg_id} is successful.`);
                  this.handlePayload(reservationMessage, msg_id);
                }
              } else if(status == 500){
                payload = reservationMessage.payload;
                localStorage.removeItem(msg_id);
                this.onmessage(payload);
              }
            }
          } else {
          }
        }
        resolve();
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket encountered an error:', error);
      };

      this.socket.onclose = () => {
        console.log('WebSocket connection is closed');
      };
    });

    await this.socketOpenPromise;
  }

  handlePayload (reservationMessage, msg_id) {
    let payload = undefined;
    if (reservationMessage.action === "create") {
      payload = "Reservation Successful";
    } else if (reservationMessage.action === "get") {
      payload = {action: "get",data: reservationMessage.data};
    } else if (reservationMessage.action === "delete") {
      payload = {action: "delete", payload: reservationMessage.payload, listingID: reservationMessage.listingID};
    }

    this.onmessage(payload);
  }

  getSocketOpenPromise() {
    return this.socketOpenPromise;
  }
}

export default WebSocketService;

// // adrian's code
// class WebSocketService {
//   constructor() {
//     this.socket = new WebSocket('ws://localhost:8282');
//     this.socketOpenPromise = new Promise((resolve) => {
//       this.socket.onopen = () => {
//         console.log('WebSocket connection is open');
//         resolve(); // Resolve the promise when the connection is open
//       };

//       this.socket.onclose = () => {
//         console.log('WebSocket connection is closed');
//       };
//     });

//     this.socket.onmessage = (event) => {
//       const server_message = (event.data).toString();
//       const reservationMessage = JSON.parse(server_message);
//       const payload = '';

//       if(this.onmessage){
//         //Get from localstorage   
//         const msg_id  = reservationMessage.msg_id;
//         const convo = localStorage.getItem(msg_id);
//         const sender = reservationMessage.sender;

//         if(convo != null){ // Message for the client
//           const status = reservationMessage.status;
//           if(status == 200){
//             const convo_dict = JSON.parse(convo);
//             if(!convo_dict.replies.includes(sender)){
//               convo_dict.replies.push(sender);

//               if (reservation.replies.length === 2) {
//                 // Mark the conversation as successful
//                 console.log(`Conversation with msg_id ${reservation.msg_id} is successful.`);
//                 payload="Reservation Successful";
//                 this.onmessage(payload);
//               }
//             }
//           }else if(status == 500){
//             payload= reservationMessage.payload;
//             this.onmessage(payload);
//           }
//         }
//       }
//     };

//   }
//   getSocketOpenPromise() {
//     return this.socketOpenPromise;
//   }
//   // setReservationFailedTimer(msg_id) {
//   //   const timeout = 5000; // 5000 milliseconds (5 seconds) as an example, adjust as needed
//   //   setTimeout(() => {
//   //     const convo = localStorage.getItem(msg_id);
//   //     if (convo != null) {
//   //       const convo_dict = JSON.parse(convo);
//   //       if (convo_dict.replies.length < 2) {
//   //         this.onReservationFailed(msg_id);
//   //       }
//   //     }
//   //   }, timeout);
//   // }

//   // markConversationAsSuccessful(msg_id) {
//   //   console.log(`Conversation with msg_id ${msg_id} is successful.`);
//   // }

//   // onReservationFailed(msg_id) {
//   //   // This function will be called when a reservation fails
//   //   console.log(`Reservation with msg_id ${msg_id} failed.`);
//   // }
// }

// export default WebSocketService;
