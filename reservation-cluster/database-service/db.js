
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: 'your-database-host',
  username: 'your-database-username',
  password: 'your-database-password',
  database: 'your-database-name',
});

module.exports = sequelize;
