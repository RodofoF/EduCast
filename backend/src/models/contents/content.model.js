const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');
const User = require('../users/user.model');

// Category: 'information', 'class', 'event', 'news', etc.
// Theme: 'math', 'portuguese', 'culture', etc.

const Content = sequelize.define('Content', {
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
    category: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    theme: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    subtitle: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    tableName: 'contents',
    timestamps: true,
});

module.exports = Content;