const express = require('express');
const kafka = require('kafka-node')
const app = express();
app.timeout = 90000; 
app.use(express.json());
const port = 5003;

const client = new kafka.KafkaClient({ kafkaHost: 'kafka-service-1:29092' });
// const client = new kafka.KafkaClient({ kafkaHost: 'localhost:29092' });
const producer = new kafka.Producer(client);

// Create a Kafka Producer
producer.on('ready', () => {
  console.log('Kafka producer is ready');
});

// Handle producer errors
producer.on('error', (error) => {
  console.error('Kafka producer error:', error);
});

app.post('/reservation', (req, res) => {
  console.log('hello world lionel');
  const userId = 123;
  const itemId = 123;

  // Create unique reservation ID by combining UserID and Datetime
  const reservationId = generateReservationId(userId);
  const datetime = new Date();
  const status = 'pending'; // Set the initial status to 'pending'
  const remarks = req.body.remarks || '';

  // Produce a reservation event to Kafka with all the necessary data
  const reservationData = {
    action: 'create',
    reservationId,
    userId,
    itemId,
    datetime,
    remarks,
    status,
  };

  // Produce to the reservation-topic
  const payloads = [
    {
      topic: 'reservation-topic',
      messages: JSON.stringify(reservationData),
    },
  ];

  // Set a flag and a timeout to handle a non-responsive Kafka producer
  let isResponseSent = false;
  const kafkaTimeout = setTimeout(() => {
      if (!isResponseSent) {
          console.error('Kafka producer readiness timeout');
          res.status(500).json({ message: 'Reservation failed due to server timeout' });
          isResponseSent = true;
      }
  }, 90000); // 10 seconds timeout for demonstration, adjust as necessary

  if (producer.ready) {
      console.log("Producer ready!")
      sendToKafka();
  } else {
      producer.on('ready', sendToKafka);
      producer.on('error', (err) => {
          if (!isResponseSent) {
              console.error('Error with Kafka producer:', err);
              res.status(500).json({ message: 'Reservation failed due to Kafka error' });
              isResponseSent = true;
          }
      });
  }

  function sendToKafka() {
      console.log("Producer sending now");
      producer.send(payloads, (error, data) => {
        console.log("Producer sent");
        clearTimeout(kafkaTimeout); // Clear the timeout once we have a response from Kafka
        if (!isResponseSent) {
          if (error) {
              console.error('Error sending message to Kafka:', error);
              console.log('Payload:', JSON.stringify(payloads));
              res.status(500).json({ message: 'Reservation failed' });
          } else {
              console.log('Message sent successfully:', data);
              console.log('Reservation request sent to the database service');
              res.status(200).json({ message: 'Reservation request sent', reservation: reservationData });
          }
          isResponseSent = true;
        }
      });
  }

  // producer.on('ready', function() {
  //   producer.send(payloads, (error, data) => {
  //     if (error) {
  //       console.error('Error sending message to Kafka:', error);
  //       console.log('Payload:', JSON.stringify(payloads));
  //       res.status(500).json({ message: 'Reservation failed' });
  //     } else {
  //       console.log('Message sent successfully:', data);
  //       console.log('Reservation request sent to the database service');
  //       res.status(200).json({ message: 'Reservation request sent', reservation: reservationData });
  //     }
  //   });
  // });
});
console.log('hello world3');
// Function to generate a unique ReservationID
function generateReservationId(userId) {
  const timestamp = Date.now();
  return `${userId}-${timestamp}`;
}

app.listen(port, () => {
  console.log(`Reservation Microservice listening at http://localhost:${port}`);
});

