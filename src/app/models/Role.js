const {Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

module.exports = sequelize.define('Role', {
    ROLEID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    ROLENAME: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    ROLECODE: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ROLEDESCRIPTION: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: false,
    freezeTableName: true,
});

