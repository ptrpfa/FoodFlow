const WebSocket = require('ws');
const http = require('http');

const server = http.createServer((req, res) => {
  // Handle HTTP requests if needed
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    // Handle messages received from clients if needed
    const msg_relay = message.toString();
    console.log(message.toString());
   
    // Broadcast the received message to all connected clients
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(msg_relay);
      }
    });
  });
});

server.listen(8282, () => {
  console.log('WebSocket server is running on port 8282');
});
