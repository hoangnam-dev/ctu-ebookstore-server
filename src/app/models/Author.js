const {Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

module.exports = sequelize.define('Author', {
    AUTHORID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    AUTHORNAME: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    AUTHORSTORY: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    AUTHORBIRTHDATE: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    AUTHORGENDER: {
        type: DataTypes.TINYINT(1),
        allowNull: false,
    },
}, {
    timestamps: false,
    freezeTableName: true,
});

