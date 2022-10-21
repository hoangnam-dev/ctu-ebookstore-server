const {Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

module.exports = sequelize.define('Permission', {
    PERMISSIONID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    PERMISSIONNAME: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    PERMISSIONCODE: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    PERMISSIONDESCRIPTION: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: false,
    freezeTableName: true,
});

