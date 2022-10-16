const Sequelize = require('sequelize');

// Declare
const sequelize = new Sequelize(
    'ebookstore', // DATABASE
    'root', // DATABASE_USERNAME
    '', // DATABASE_PASSWORD
    {
       host: 'localhost', // DATABASE_HOST
       dialect: 'mysql', // DBMS
    }
);

// Connection
sequelize.sync().then(() => {
    console.log('Connection has been established successfully.');
 }).catch((error) => {
    console.error('Unable to connect to the database: ', error);
 });

 module.exports = sequelize;
