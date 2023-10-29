const { Consumer, KafkaClient } = require('kafka-node');
const sequelize = require('./db');
const client = new KafkaClient({ kafkaHost: 'localhost:29092' });

// test for connection
console.log('Reservation Service is starting...');

const consumer = new Consumer(client, [{ topic: 'reservation' }], { groupId: 'reservation-group' });

consumer.on('message', (message) => {
  const payload = JSON.parse(message.value);

  // Process the Kafka message and update the database
  sequelize.sync().then(() => {
    if (payload.type === 'create') {
      // Insert a new reservation into the database
      sequelize.models.Reservation.create({
        userId: payload.userId,
        itemId: payload.itemId,
        reservationId: payload.reservationId,
        datetime: payload.datetime,
        status: payload.status,
      });
    } else if (payload.type === 'update') {
      // Update an existing reservation in the database
      sequelize.models.Reservation.update(
        { status: payload.status }, // Update the status or other fields as needed
        { where: { reservationId: payload.reservationId } }
      );
    } else if (payload.type === 'cancel') {
      // Delete a reservation from the database
      sequelize.models.Reservation.destroy({ where: { reservationId: payload.reservationId } });
    }
  });
});
