const Kafka = require('node-rdkafka');
const sequelize = require('./db'); // Import your database connection

const consumer = new Kafka.KafkaConsumer({
  'metadata.broker.list': 'your-kafka-broker-host',
  'group.id': 'reservation-group',
});

consumer.connect();

consumer.on('ready', () => {
  consumer.subscribe(['reservation-topic']);
  consumer.consume();
});

consumer.on('data', (message) => {
  const payload = JSON.parse(message.value.toString());

  // Process the Kafka message and update the database
  // Example: Insert reservation data into the database

  sequelize.sync().then(() => {
    sequelize.models.Reservation.create({
      userId: payload.userId,
      itemId: payload.itemId,
      // Add more fields as needed
    });
  });
});
