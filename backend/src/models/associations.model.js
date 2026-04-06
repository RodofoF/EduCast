const User = require('./users/user.model');
const UserGroup = require('./users/user.groups.model');
const Content = require('./contents/content.model');
const OnDemand = require('./ondemand/ondemand.model');
const Live = require('./live/live.model');

const setupAssociations = () => {
    UserGroup.belongsTo(User, { foreignKey: 'userId', as: 'user' });
    User.hasMany(UserGroup, { foreignKey: 'userId', as: 'userGroups' });

    Content.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
    User.hasMany(Content, { foreignKey: 'user_id', as: 'contents' });

    OnDemand.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
    User.hasMany(OnDemand, { foreignKey: 'user_id', as: 'ondemands' });

    Live.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
    User.hasMany(Live, { foreignKey: 'user_id', as: 'lives' });

}

module.exports = setupAssociations;