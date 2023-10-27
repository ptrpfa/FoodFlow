// reservation-microservice.js
const express = require('express');
const { Kafka, logLevel } = require('kafka-node');
const app = express();
const port = 3000;

const kafkaClient = new Kafka.Client('your-kafka-broker-host', 'reservation-service');
const producer = new Kafka.Producer(kafkaClient);

// API endpoint for making a reservation
app.post('/reservation', (req, res) => {
  const userId = req.body.userId;
  const itemId = req.body.itemId;

  // Validate the reservation request and enforce business rules, such as max 20 reservations per user.

  // Produce a reservation event to Kafka
  const payloads = [
    {
      topic: 'reservation-topic',
      messages: JSON.stringify({ type: 'reservation', userId, itemId }),
    },
  ];

  producer.send(payloads, (error, data) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: 'Reservation failed' });
    } else {
      console.log('Reservation successful');
      res.status(200).json({ message: 'Reservation successful' });
    }
  });
});

// API endpoint for canceling a reservation
app.delete('/reservation/:reservationId', (req, res) => {
  const reservationId = req.params.reservationId;

  // Implement the logic to cancel the reservation in your database or reservation data store.
  res.status(204).end();
});

app.listen(port, () => {
  console.log(`Reservation Microservice listening at http://localhost:${port}`);
});

