class WebSocketService {
  constructor() {
    this.socket = new WebSocket('ws://localhost:8282');
    this.socketOpenPromise = new Promise((resolve) => {
      this.socket.onopen = () => {
        console.log('WebSocket connection is open');
        resolve(); 
      };

      this.socket.onclose = () => {
        console.log('WebSocket connection is closed');
      };
    });

    this.socket.onmessage = (event) => {
      const server_message = (event.data).toString();
      const reservationMessage = JSON.parse(server_message);
      var payload = '';

      if(this.onmessage){
        //Get from localstorage   
        const msg_id  = reservationMessage.msg_id;
        const convo = localStorage.getItem(msg_id);
        const sender = reservationMessage.sender;

        if(convo != null){ // Message for the client
          const status = reservationMessage.status;
          if(status == 200){
            const convo_dict = JSON.parse(convo);
            if(!convo_dict.replies.includes(sender)){
              convo_dict.replies.push(sender);

              if (convo_dict.replies.length === 1) {
                // Mark the conversation as successful
                console.log(`Conversation with msg_id ${msg_id} is successful.`);
                payload="Reservation Successful";
                this.onmessage(payload);
              }
            }
          }else if(status == 500){
            payload= reservationMessage.payload;
            this.onmessage(payload);
          }
        }
      }
    };

  }
  getSocketOpenPromise() {
    return this.socketOpenPromise;
  }
  // setReservationFailedTimer(msg_id) {
  //   const timeout = 5000; // 5000 milliseconds (5 seconds) as an example, adjust as needed
  //   setTimeout(() => {
  //     const convo = localStorage.getItem(msg_id);
  //     if (convo != null) {
  //       const convo_dict = JSON.parse(convo);
  //       if (convo_dict.replies.length < 2) {
  //         this.onReservationFailed(msg_id);
  //       }
  //     }
  //   }, timeout);
  // }

  // markConversationAsSuccessful(msg_id) {
  //   console.log(`Conversation with msg_id ${msg_id} is successful.`);
  // }

  // onReservationFailed(msg_id) {
  //   // This function will be called when a reservation fails
  //   console.log(`Reservation with msg_id ${msg_id} failed.`);
  // }
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
