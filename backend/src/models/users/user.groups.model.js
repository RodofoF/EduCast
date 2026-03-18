const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const UserGroup = sequelize.define('UserGroup', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    groupId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'user_groups',
    timestamps: true,
});



module.exports = UserGroup;