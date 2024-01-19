const { Sequelize, DataTypes } = require('sequelize');
const ReservationModel = require('./reservation'); 
const ListingModel = require('./listing');

const sequelize = new Sequelize('foodflow', 'root', process.env.DATABASE_PASSWORD, {
  host: process.env.DATABASE_HOST,
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
