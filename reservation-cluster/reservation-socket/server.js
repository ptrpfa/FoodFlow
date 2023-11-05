const WebSocket = require('ws');

const reservationNodeSocket = new WebSocket('ws://localhost:8282'); // Replace with the actual WebSocket server URL

reservationNodeSocket.on('open', () => {
  console.log('Connected to WebSocket server');
  
  // Simulate a new reservation being produced
  const newReservation = {
    msg_id: 123,
    sender:  'database-controller',
    product_id: 12,
    payload: 'Example Product',
    // Add other reservation details here
  };
  
  // Convert the reservation to a JSON string
  const reservationMessage = JSON.stringify(newReservation);

  // Send the reservation message to the WebSocket server
  reservationNodeSocket.send(reservationMessage);
});
