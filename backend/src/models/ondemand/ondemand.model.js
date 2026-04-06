const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');
const User = require('../users/user.model');

const OnDemand = sequelize.define('OnDemand', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    subtitle: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    theme: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    thumbnail_url: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    video_url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'ondemand',
    timestamps: true,
});

module.exports = OnDemand;