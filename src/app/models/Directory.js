const Sequelize = require('sequelize');
const sequelize = require('../../config/db');

module.exports = sequelize.define('Directory', {
    DIRECTORYID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    DIRECTORYNAME: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    DIRECTORYDESCRIPTION: {
        type: Sequelize.STRING,
        allowNull: false,
    },
}, {
    timestamps: false,
    freezeTableName: true,
});

