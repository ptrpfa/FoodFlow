
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('foodflow', 'root', 'sikeloong', {
  host: '34.124.232.171',
  port: 3306,
  dialect: 'mysql',
});

module.exports = sequelize;
