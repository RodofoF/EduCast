const User = require('./users/user.model');
const UserGroup = require('./users/user.groups.model');

const setupAssociations = () => {
    UserGroup.belongsTo(User, { foreignKey: 'userId', as: 'user' });
    User.hasMany(UserGroup, { foreignKey: 'userId', as: 'userGroups' });
}

module.exports = setupAssociations;