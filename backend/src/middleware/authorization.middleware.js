function normalizeGroups(userGroups) {
  if (!Array.isArray(userGroups)) {
    return [];
  }

  return userGroups
    .map(group => Number(group))
    .filter(groupId => Number.isInteger(groupId));
}

function hasAnyGroup(user, allowedGroups) {
  const normalizedUserGroups = normalizeGroups(user?.userGroups);
  const normalizedAllowedGroups = normalizeGroups(allowedGroups);

  return normalizedAllowedGroups.some(group => normalizedUserGroups.includes(group));
}

function authorizeAdmin(req, res, next) {
  if (hasAnyGroup(req.user, [1])) {
    return next();
  }

  return res.status(403).json({ error: 'Access denied. Admins only.' });
}

function authorizeUserOrAdmin(req, res, next) {
  if (hasAnyGroup(req.user, [1, 2, 3])) {
    return next();
  }

  return res.status(403).json({ error: 'Access denied.' });
}

module.exports = { authorizeAdmin, authorizeUserOrAdmin };