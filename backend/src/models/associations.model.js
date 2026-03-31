const User = require('./users/user.model');
const UserGroup = require('./users/user.groups.model');
const Content = require('./contents/content.model');

const setupAssociations = () => {
    UserGroup.belongsTo(User, { foreignKey: 'userId', as: 'user' });
    User.hasMany(UserGroup, { foreignKey: 'userId', as: 'userGroups' });

    Content.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
    User.hasMany(Content, { foreignKey: 'user_id', as: 'contents' });

}

module.exports = setupAssociations;