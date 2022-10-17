const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../../config/db');

module.exports = sequelize.define('Directory', {
    DIRECTORYID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    DIRECTORYNAME: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    DIRECTORYDESCRIPTION: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: false,
    freezeTableName: true,
});

