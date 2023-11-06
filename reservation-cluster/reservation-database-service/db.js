const { Sequelize, DataTypes } = require('sequelize');
const ReservationModel = require('./reservation'); 
const ListingModel = require('./listing');

const sequelize = new Sequelize('foodflow', 'root', 'sikeloong', {
  host: '34.124.250.62',
  port: 3306,
  dialect: 'mysql',
});

//init the Models
const Reservation = ReservationModel(sequelize, DataTypes);
const Listing = ListingModel(sequelize, DataTypes);

//Validate Connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

sequelize.sync();

module.exports = {
  sequelize,
  Reservation,
  Listing
};
