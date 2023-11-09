const express = require("express");
const kafka = require("kafka-node");
const app = express();
app.timeout = 90000;
app.use(express.json());
const port = 5003;

const client = new kafka.KafkaClient({ kafkaHost: "kafka-service-1:9092" });
const producer = new kafka.Producer(client);

// Create a Kafka Producer
producer.on("ready", () => {
  console.log("Kafka producer is ready");
});

// Handle producer errors
producer.on("error", (error) => {
  console.error("Kafka producer error:", error);
});
//create Reservation Request
app.post("/reservation/create", (req, res) => {
  const UserID = req.body.UserID;
  const ListingID = req.body.ListingID;
  const Datetime = new Date();
  const Remarks = req.body.Remarks || "";
  const msg_id = req.body.msg_id;

  // Produce a reservation event to Kafka with all the necessary data
  const reservationData = {
    action: "create",
    msg_id,
    UserID,
    ListingID,
    Datetime,
    Remarks,
  };
  console.log(reservationData);
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
        .json({ msg_id: msg_id, message: "Reservation failed due to kafka server timeout" });
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
          .json({ msg_id: msg_id, message: "Reservation failed due to Kafka producer not ready" });
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
          res.status(500).json({ msg_id: msg_id, message: "Reservation failed due to message sending error" });
        } else {
          console.log("Message sent successfully:", data);
          console.log("Reservation request sent to the database service");

          // Send the reservation message to the WebSocket server
          res.status(200).json({
            msg_id: msg_id,
            message: "Reservation request sent",
            reservation: reservationData,
            sender: "reservation-controller"
          });
        }
        isResponseSent = true;
      }
    });
  }
});

// Delete Reservation Request
app.delete("/reservation/delete/:ReservationID", (req, res) => {
  const ReservationID = req.params.ReservationID; 
  const msg_id = req.body.msg_id;

  // Payload for Kafka message
  const reservationData = {
    action: "delete",
    ReservationID,
    msg_id
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
      res.status(500).json({ msg_id: msg_id, message: "Delete reservation failed due to server timeout" });
      isResponseSent = true;
    }
  }, 90000); 

  function sendToKafka() {
    producer.send(payloads, (error, data) => {
      clearTimeout(kafkaTimeout); 
      if (!isResponseSent) {
        if (error) {
          console.error("Error sending message to Kafka:", error);
          res.status(500).json({msg_id: msg_id, message: "Delete reservation failed" });
        } else {
          console.log("Delete reservation request sent successfully:", data);
          res.status(200).json({
            msg_id: msg_id,
            message: "Delete reservation request sent",
            reservation: reservationData,
            sender: "reservation-controller",
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
    res.status(500).json({ msg_id: msg_id, message: "Kafka producer not ready" });
  }
});

//Get Reservation Request
app.get("/reservation/:UserID", (req,res) => {
  const UserID = req.params.UserID;
  const msg_id = req.query.msg_id;

  // Payload for Kafka message
  const reservationData = {
    action: "get",
    msg_id,
    UserID,
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
      res.status(500).json({ msg_id: msg_id, message: "Get reservation failed due to server timeout" });
      isResponseSent = true;
    }
  }, 90000); 

  function sendToKafka() {
    producer.send(payloads, (error, data) => {
      clearTimeout(kafkaTimeout); 
      if (!isResponseSent) {
        if (error) {
          console.error("Error sending message to Kafka:", error);
          res.status(500).json({ msg_id: msg_id, message: "Get reservation failed" });
        } else {
          console.log("Get reservation request sent successfully:", data);
          res.status(200).json({
            msg_id: msg_id,
            message: "Get reservation request sent",
            reservation: reservationData,
            sender: "reservation-controller",
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
    res.status(500).json({ msg_id: msg_id, message: "Kafka producer not ready" });
  }


});

app.listen(port, () => {
  console.log(`Reservation Microservice listening at http://localhost:${port}`);
});

