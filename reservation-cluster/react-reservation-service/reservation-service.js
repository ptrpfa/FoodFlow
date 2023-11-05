const express = require("express");
const kafka = require("kafka-node");
const app = express();
app.timeout = 90000;
app.use(express.json());
const port = 5003;

const client = new kafka.KafkaClient({ kafkaHost: "kafka-service-1:29092" });
const producer = new kafka.Producer(client);

const WebSocket = require('ws');
const reservationServerSocket = new WebSocket('ws://host.docker.internal:8282');

// Create a Kafka Producer
producer.on("ready", () => {
  console.log("Kafka producer is ready");
});

reservationServerSocket.on('open', () => {
  console.log('Connected to WebSocket server');
});

// Handle producer errors
producer.on("error", (error) => {
  console.error("Kafka producer error:", error);
});
//create Reservation Request
app.post("/reservation/create", (req, res) => {
  console.log("hello Create Function");
  const UserID = req.body.UserID;
  const ListingID = req.body.ListingID;
  const Datetime = new Date();
  const Remarks = req.body.Remarks || "";

  // Produce a reservation event to Kafka with all the necessary data
  const reservationData = {
    action: "create",

  };

  // Produce to the reservation-topic
  const payloads = [
    {
      topic: "reservation-topic",
      messages: JSON.stringify(reservationData),
    },
  ];

  // Set a flag and a timeout to handle a non-responsive Kafka producer
  let isResponseSent = false;
  const kafkaTimeout = setTimeout(() => {
    if (!isResponseSent) {
      console.error("Kafka producer readiness timeout");
      res
        .status(500)
        .json({ message: "Reservation failed due to server timeout" });
      isResponseSent = true;
    }
  }, 90000); 

  if (producer.ready) {
    console.log("Producer ready!");
    sendToKafka();
  } else {
    console.log("Producer not ready!");
    producer.on("ready", sendToKafka);
    producer.on("error", (err) => {
      if (!isResponseSent) {
        console.error("Error with Kafka producer:", err);
        res
          .status(500)
          .json({ message: "Reservation failed due to Kafka error" });
        isResponseSent = true;
      }
    });
  }

  function sendToKafka() {
    console.log("Producer sending now");
    producer.send(payloads, (error, data) => {
      console.log("Producer sent", payloads);
      clearTimeout(kafkaTimeout); // Clear the timeout once we have a response from Kafka
      if (!isResponseSent) {
        if (error) {
          console.error("Error sending message to Kafka:", error);
          console.log("Payload:", JSON.stringify(payloads));
          res.status(500).json({ message: "Reservation failed" });
        } else {
          console.log("Message sent successfully:", data);
          console.log("Reservation request sent to the database service");
            //Simulate a new reservation being produced
            const newReservation = {
              msg_id: 123,
              product_id: 12,
              payload: 'Product Recieved',
              sender: 'reservation-controller'
              // Add other reservation details here
            };
            
            // Convert the reservation to a JSON string
            const reservationMessage = JSON.stringify(newReservation);

            // Send the reservation message to the WebSocket server
            reservationServerSocket.send(reservationMessage);

          res.status(200).json({
            message: "Reservation request sent",
            reservation: reservationData,
          });
        }
        isResponseSent = true;
      }
    });
  }
});

// Delete Reservation Request
app.delete("/reservation/delete", (req, res) => {
  console.log("Processing Delete Function");
  const ReservationID = req.body.ReservationID;

  // Payload for Kafka message
  const reservationData = {
    action: "delete",
    ReservationID,
  };

  const payloads = [
    {
      topic: "reservation-topic",
      messages: JSON.stringify(reservationData),
    },
  ];

  let isResponseSent = false;
  const kafkaTimeout = setTimeout(() => {
    if (!isResponseSent) {
      console.error("Kafka producer readiness timeout");
      res.status(500).json({ message: "Delete reservation failed due to server timeout" });
      isResponseSent = true;
    }
  }, 90000); 

  function sendToKafka() {
    producer.send(payloads, (error, data) => {
      clearTimeout(kafkaTimeout); 
      if (!isResponseSent) {
        if (error) {
          console.error("Error sending message to Kafka:", error);
          res.status(500).json({ message: "Delete reservation failed" });
        } else {
          console.log("Delete reservation request sent successfully:", data);
          res.status(200).json({
            message: "Delete reservation request sent",
            reservation: reservationData,
          });
        }
        isResponseSent = true;
      }
    });
  }

  if (producer.ready) {
    sendToKafka();
  } else {
    console.error("Kafka producer not ready, cannot send message");
    res.status(500).json({ message: "Kafka producer not ready" });
  }
});

app.listen(port, () => {
  console.log(`Reservation Microservice listening at http://localhost:${port}`);
});

