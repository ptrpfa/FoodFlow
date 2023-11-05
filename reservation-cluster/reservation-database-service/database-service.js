const kafka = require('kafka-node');
const { sequelize, Reservation, Listing } = require('./db');

const client = new kafka.KafkaClient({ kafkaHost: "kafka-service-1:29092" });
const consumer = new kafka.Consumer(client, [{ topic: 'reservation-topic' }], { groupId: 'reservation-group' });

consumer.on('message', async (message) => {
   console.log("Kafka Consumer message received");
   const payload = JSON.parse(message.value);

   //create reservation
   if (payload.action === 'create') {
      const transaction = await sequelize.transaction();
      try {
         // Check if the listing is available
         const listing = await Listing.findByPk(payload.ListingID, { transaction });
         if (!listing || listing.Status !== 1) {
            throw new Error('Listing is not available');
         }
         // Create the reservation
         const reservation = await Reservation.create({
            UserID: payload.UserID,
            ListingID: payload.ListingID,
            Datetime: payload.Datetime,
            Remarks: payload.Remarks,
         }, { transaction });

         // Update the Listing.Status to 0 to make it not available
         await Listing.update({ Status: 0 }, {
            where: { ListingID: payload.ListingID },
            transaction
         });

         // Commit the transaction
         await transaction.commit();
         console.log(`Reservation ID ${reservation.id} created for Listing ID ${payload.ListingID}`);
      } catch (error) {
         // Rollback the transaction in case of any error
         await transaction.rollback();
         console.error("Error processing reservation creation:", error.message);
      }
   }
   // Delete reservation
   else if (payload.action === 'delete') {
      const transaction = await sequelize.transaction();
      try {
      // Get the reservation to find the associated ListingID
      const reservation = await Reservation.findByPk(payload.ReservationID, { transaction });
      if (!reservation) {
         throw new Error('Reservation not found');
      }
      // Extract the ListingID from the reservation
      const { ListingID } = reservation;

      // Delete the reservation
      await Reservation.destroy({
         where: { ReservationID: payload.ReservationID },
         transaction
      });

      // Update the Listing.Status to 1 to make it available
      await Listing.update({ Status: 1 }, {
         where: { ListingID: ListingID },
         transaction
      });

      // Commit the transaction
      await transaction.commit();
      console.log(`Reservation ID ${payload.ReservationID} deleted and Listing ID ${ListingID} set to available.`);
      } catch (error) {
      // Rollback the transaction in case of any error
      await transaction.rollback();
      console.error("Error processing reservation deletion:", error);
      }
   }
   else if (payload.action === 'get')
      try {
         // Fetch all reservations for the given UserID
         const reservations = await Reservation.findAll({
         where: { UserID: payload.UserID },
         });
         console.log(`Reservations fetched for User ID ${payload.UserID}:`, reservations);
      } catch (error) {
         console.error("Error processing reservation retrieval:", error);
       }
       //send the response over to react
       //connect socket

});





