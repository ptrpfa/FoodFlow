const { Reservation } = require('./db'); // No changes required here if db.js is in the same directory
const kafka = require('kafka-node');
const client = new kafka.KafkaClient({ kafkaHost: "kafka-service-1:29092" });
const consumer = new kafka.Consumer(client, [{ topic: 'reservation-topic' }], { groupId: 'reservation-group' });

consumer.on('message', (message) => {
  console.log("Kafka Consumer is ready");
  const payload = JSON.parse(message.value);

  // Process the Kafka message and update the database
  sequelize.sync().then(() => {
    if (payload.action === 'create') {
      // Insert a new reservation into the database
      Reservation.create({
        userId: payload.userId,
        itemId: payload.itemId, 
        reservationId: payload.reservationId,
        datetime: payload.datetime,
        status: payload.status,
      });
    } else if (payload.action === 'update') {
      Reservation.update(
        { status: payload.status }, // Update the status or other fields as needed
        { where: { reservationId: payload.reservationId } }
      );
    } else if (payload.action === 'cancel') {
      Reservation.destroy({ where: { reservationId: payload.reservationId } });
    }
  });
});