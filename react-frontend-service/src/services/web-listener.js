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
      // const reservationMessage = JSON.parse(event.data); 
      // const message = reservationMessage.payload;
      // console.log('Received message:', message);
      
      // // Call the onmessage callback if it is defined
      // if (this.onmessage) {
      //   this.onmessage(message, false); // Assuming it's not binary
      // }
      const server_message = (event.data).toString();
      const reservationMessage = JSON.parse(server_message);
      // const payload = JSON.parse(reservationMessage);

      console.log('Received message:', reservationMessage);
      // Call the onmessage callback if it is defined
      if (this.onmessage) {
        this.onmessage(reservationMessage.payload, false); // Assuming it's not binary
      }

    };
  }
}

export default WebSocketService;
