const { Model, DataTypes } = require('sequelize');
const sequelize = require('./db'); // Update the relative path to your db.js

class Reservation extends Model {}

Reservation.init({
  reservationId: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  itemId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  datetime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false
  },
  remarks: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'Reservation',
  timestamps: false // Adjust this according to whether you have these columns
});

module.exports = Reservation;
