const WebSocket = require('ws');

const reservationNodeSocket = new WebSocket('ws://localhost:8282'); 

reservationNodeSocket.on('open', () => {
  console.log('Connected to WebSocket server');
  
  const newReservation = {

  };
  
  // Convert the reservation to a JSON string
  const reservationMessage = JSON.stringify(newReservation);

  // Send the reservation message to the WebSocket server
  reservationNodeSocket.send(reservationMessage);
});
