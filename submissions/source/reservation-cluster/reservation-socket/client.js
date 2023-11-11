const WebSocket = require('ws');

const webSocket = new WebSocket('ws://localhost:8181'); 

webSocket.onmessage = (event) => {
  // Handle the received message
  const receivedReservation = JSON.parse(event.data);
  console.log(receivedReservation);
};

webSocket.addEventListener("open", () => {
  console.log("We are connected");
});