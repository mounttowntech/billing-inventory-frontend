export const hasPermission = (user, module, action = "read") => {
  if (!user?.role?.permissions) return false;

  const permission = user.role.permissions.find(
    (item) => item.module.toLowerCase() === module.toLowerCase()
  );

  if (!permission) return false;

  return permission[action] === true;
};