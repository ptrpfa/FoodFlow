const { Sequelize } = require('sequelize');
const ReservationModel = require('./reservation'); // Update the relative path to your reservation model

const sequelize = new Sequelize('foodflow', 'root', 'sikeloong', {
  host: '34.124.232.171',
  port: 3306,
  dialect: 'mysql',
});

// Initialize the model
const Reservation = ReservationModel(sequelize, Sequelize);


sequelize.sync();

module.exports = {
  sequelize, // the sequelize instance
  Reservation // the model
};
