const express = require('express');
const { kafka, logLevel, KafkaClient, Producer } = require('kafka-node');
const app = express();
const port = 3000;

const kafkaClient = new KafkaClient({ kafkaHost: 'localhost:29092' }); // Use KafkaClient
const producer = new Producer(kafkaClient);

// Create a Kafka Producer
producer.on('ready', () => {
  console.log('Kafka producer is ready');
});

// Handle producer errors
producer.on('error', (error) => {
  console.error('Kafka producer error:', error);
});

app.use(express.json());

app.post('/reservation/create', (req, res) => {
  const userId = req.body.userId;
  const itemId = req.body.itemId;

  // Generate a unique reservation ID by combining UserID and Datetime
  const reservationId = generateReservationId(userId);
  const datetime = new Date();
  const status = 'pending'; // Set the initial status to 'pending'
  const remarks = req.body.remarks || '';

  // Produce a reservation event to Kafka with all the necessary data
  const reservationData = {
    action: 'create', // Use "action" instead of "type"
    reservationId,
    userId,
    itemId,
    datetime,
    status,
    remarks,
  };

  // Produce to the "reservation" topic
  const payloads = [
    {
      topic: 'reservation',
      messages: JSON.stringify(reservationData),
    },
  ];

  producer.send(payloads, (error, data) => {
    if (error) {
      console.error('Error sending message to Kafka:', error);
      res.status(500).json({ message: 'Reservation failed' });
    } else {
      console.log('Reservation request sent to the database service');
      res.status(200).json({ message: 'Reservation request sent', reservation: reservationData });
    }
  });
});

// Function to generate a unique ReservationID
function generateReservationId(userId) {
  const timestamp = Date.now();
  return `${userId}-${timestamp}`;
}

app.listen(port, () => {
  console.log(`Reservation Microservice listening at http://localhost:${port}`);
});
