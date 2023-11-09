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
              localStorage.setItem(msg_id, JSON.stringify(convo_dict));
              
              console.log(convo_dict.replies);
              if (convo_dict.replies.length === 2) {
                // Mark the conversation as successful
                // console.log(`Conversation with msg_id ${msg_id} is successful.`);
                // payload="Reservation Successful";
                localStorage.removeItem(msg_id);
                this.handlePayload(reservationMessage);
              }
            }
          }else if(status == 500){
            payload= reservationMessage.payload;
            localStorage.removeItem(msg_id);
            this.onmessage(payload);
          }
        }
      }
    };

  }
  getSocketOpenPromise() {
    return this.socketOpenPromise;
  }

  handlePayload (reservationMessage) {
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
}

export default WebSocketService;
