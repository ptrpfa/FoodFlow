const kafka = require('kafka-node');
const { sequelize, Reservation, Listing } = require('./db');
const client = new kafka.KafkaClient({ kafkaHost: "kafka-service-1:9092" });
const topicToWaitFor = 'reservation-topic';




// WebSocket setup
const WebSocket = require('ws');
const wsUrl = 'ws://host.docker.internal:8282';
const databaseServerSocket = new WebSocket(wsUrl);

databaseServerSocket.on('open', () => {
  console.log('Database Controller: Connected to WebSocket server');
});

// Function to check if the topic exists
function checkTopicAvailability() {
   return new Promise((resolve, reject) => {
     client.loadMetadataForTopics([topicToWaitFor], (error, results) => {
       if (error) {
         console.error('Error loading metadata:', error);
         reject(error);
       } else {
         const metadata = results[1].metadata[topicToWaitFor];
         if (metadata) {
           // Topic exists, resolve the promise
           console.log(`The topic "${topicToWaitFor}" is available.`);
           resolve();
         } else {
           // Topic does not exist, retry after a delay
           console.log(`The topic "${topicToWaitFor}" does not exist. Retrying...`);
           setTimeout(checkTopicAvailability, 5000); // Retry after 5 seconds (adjust the delay as needed)
         }
       }
     });
   });
 }

checkTopicAvailability().then(() => {
      const consumer = new kafka.Consumer(client, [{ topic: topicToWaitFor }], { groupId: 'reservation-group' }); 
      consumer.on('message', async (message) => {
         
         console.log("Kafka Consumer message received");
         const payload = JSON.parse(message.value);
         const msg_id = payload.msg_id;
         
         //create reservation
         if (payload.action === 'create') {
            const transaction = await sequelize.transaction();
            try {
               // Check if the listing is available
               const listing = await Listing.findByPk(payload.ListingID, { transaction });
               if (!listing || listing.Status !== 1) {
                  const newReservation = {
                  msg_id: msg_id,
                  status: 500,
                  payload: 'Listing is not available',
                  sender: 'reservation-controller'
                  };
                  // Convert the reservation to a JSON string
                  const reservationMessage = JSON.stringify(newReservation);

                  //Send the reservation message to the WebSocket server
                  databaseServerSocket.send(reservationMessage);

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
               const newReservation = {
                  action:'create',
                  msg_id: msg_id,
                  status: 200,
                  sender: 'reservation-controller'
               };
               // Convert the reservation to a JSON string
               const reservationMessage = JSON.stringify(newReservation);

               //Send the reservation message to the WebSocket server
               databaseServerSocket.send(reservationMessage);
            } catch (error) {
               // Rollback the transaction in case of any error
               await transaction.rollback();
               
               const newReservation = {
                  msg_id: msg_id,
                  status: 500,
                  payload: `Error processing reservation creation: ${error.message}`,
                  sender: 'reservation-controller'
               };
               // Convert the reservation to a JSON string
               const reservationMessage = JSON.stringify(newReservation);

               //Send the reservation message to the WebSocket server
               databaseServerSocket.send(reservationMessage);

               console.error("Error processing reservation creation:", error.message);
            }
         }
         // Delete reservation
         else if (payload.action === 'delete') {
            const transaction = await sequelize.transaction();
            try {
              // Get the reservation to find the associated ListingID
              console.log(payload.ReservationID)
              const reservation = await Reservation.findByPk(payload.ReservationID, { transaction });
              if (!reservation) {
                const errorMessage = `Reservation with ID ${payload.ReservationID} not found.`;
                console.error(errorMessage);
                throw new Error(errorMessage);
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
              // Send a WebSocket message to the client to inform of success
              const deleteSuccessMessage = {
                action: 'delete',
                msg_id: payload.msg_id,
                status: 200,
                payload: `Reservation ID ${payload.ReservationID} successfully deleted.`,
                sender: 'reservation-controller'
              };
              databaseServerSocket.send(JSON.stringify(deleteSuccessMessage));
            } catch (error) {
              // Rollback the transaction in case of any error
              await transaction.rollback();
              console.error("Error processing reservation deletion:", error);
              // Send a WebSocket message to the client to inform of the error
              const deleteErrorMessage = {
                msg_id: payload.msg_id,
                status: 500,
                payload: `Error processing reservation deletion: ${error.message}`,
                sender: 'reservation-controller'
              };
              databaseServerSocket.send(JSON.stringify(deleteErrorMessage));
            }
          }
         else if (payload.action === 'get')
            try {
               // Fetch all reservations for the given UserID
               const reservations = await Reservation.findAll({
               where: { UserID: payload.UserID },
               });
                 // Package the reservations in a message object
               const getReservation = {
                  type: 'RESERVATION_DATA', 
                  data: reservations 
               };
                //Send the reservation message to the WebSocket server
               const reservationMessage = JSON.stringify(getReservation);
               databaseServerSocket.send(reservationMessage);               
               console.log(`Reservations fetched for User ID ${payload.UserID}:`, reservationMessage);
            } catch (error) {
               console.error("Error processing reservation retrieval:", error);
            }
      });
  })
  .catch((error) => {
      // is already rejected
  });