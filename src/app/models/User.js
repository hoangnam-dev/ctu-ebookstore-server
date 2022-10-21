const {Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

module.exports = sequelize.define('User', {
    USERID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    USERNAME: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    USERUSERNAME: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    USERPASSWORD: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    USERGENDER: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    USERBIRTHDAY: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    USERCCCD: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    USERAVATAR: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    USERADDRESS: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    USERPHONE: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    USEREMAIL: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    USERBANKNUMBER: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    USERSTATUS: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    PROVINCEID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    DISTRICTID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    WARDID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    ROLEID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: false,
    freezeTableName: true,
});

