const WebSocket = require('ws');

const reservationNodeSocket = new WebSocket('ws://localhost:8181'); // Replace with the actual WebSocket server URL

reservationNodeSocket.on('open', () => {
  console.log('Connected to WebSocket server');
  
  // Simulate a new reservation being produced
  const newReservation = {
    id: 123,
    productName: 'Example Product',
    // Add other reservation details here
  };
  
  // Convert the reservation to a JSON string
  const reservationMessage = JSON.stringify(newReservation);

  // Send the reservation message to the WebSocket server
  reservationNodeSocket.send(reservationMessage);
});
