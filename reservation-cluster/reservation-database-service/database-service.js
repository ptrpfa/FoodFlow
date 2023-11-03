const { sequelize, Reservation, Listing } = require('./db');

const kafka = require('kafka-node');
const client = new kafka.KafkaClient({ kafkaHost: "kafka-service-1:29092" });
const consumer = new kafka.Consumer(client, [{ topic: 'reservation-topic' }], { groupId: 'reservation-group' });

consumer.on('message', (message) => {
  console.log("Kafka Consumer is ready");
  console.log(message);
  const payload = JSON.parse(message.value);

  if (payload.action === 'create') {
    // Insert a new reservation into the database
    Reservation.create({
      UserID: payload.UserID,
      ListingID: payload.ListingID,
      Datetime: payload.Datetime,
      Remarks: payload.Remarks,
    })
      .then((reservation) => {
        console.log(`Reservation ID ${reservation.ReservationID} created`);
        // Update the Listing.Status to 0 to make it not available
        return Listing.update(
          { Status: 0 },
          {
            where: { ListingID: payload.ListingID },
          }
        );
      })
      .catch((error) => console.error(error)); // Add error handling
  }
  if (payload.action === 'delete') {
    // Delete a reservation from the database
    Reservation.destroy({
      where: { ReservationID: payload.ReservationID },
    })
      .then(() => {
        console.log(`Reservation ID ${payload.ReservationID} deleted`);
        // Update the Listing.Status to 1 to make it available 
        return Listing.update(
          { Status: 1 },
          {
            where: { ListingID: payload.ListingID },
          }
        );
      })
      .catch((error) => console.error(error)); // Add error handling
  }
});
