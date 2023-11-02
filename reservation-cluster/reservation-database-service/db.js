const { Sequelize, DataTypes } = require('sequelize');
const ReservationModel = require('./reservation'); 

const sequelize = new Sequelize('foodflow', 'root', 'sikeloong', {
  host: '34.124.232.171',
  port: 3306,
  dialect: 'mysql',
});

const Reservation = ReservationModel(sequelize, DataTypes);
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
  Reservation
};
