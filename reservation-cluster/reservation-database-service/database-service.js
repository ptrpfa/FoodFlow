const { sequelize, Reservation } = require('./db');

const kafka = require('kafka-node');
const client = new kafka.KafkaClient({ kafkaHost: "kafka-service-1:29092" });
const consumer = new kafka.Consumer(client, [{ topic: 'reservation-topic' }], { groupId: 'reservation-group' });

consumer.on('message', (message) => {
  console.log("Kafka Consumer is ready");
  console.log(message)
  const payload = JSON.parse(message.value);

  if (payload.action === 'create') {
    // Insert a new reservation into the database
    Reservation.create({
      UserID: payload.UserID,
      ListingID: payload.ListingID, 
      Datetime: payload.Datetime,
      Remarks: payload.Remarks,
    }).catch(error => console.error(error)); // Add error handling
  } 
});
