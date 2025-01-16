import emailTemplate from "./emailTemplate";
import token from "./token";
import tokenType from "./tokenType";
import userOtp from "./userOtp";
import user from "./user";
import roles from "./role";

roles.hasOne(user, {
  foreignKey: 'roleId',
});
user.belongsTo(roles, {
  foreignKey: 'roleId',
});
user.hasMany(token, {
  foreignKey: 'userId',
});
token.belongsTo(user, {
  foreignKey: 'userId',
});
token.belongsTo(tokenType, {
  foreignKey: 'typeId',
});
tokenType.hasMany(token, {
  foreignKey: 'typeId',
});

export {
  token,
  emailTemplate,
  module,
  tokenType,
  userOtp,
  user,
};
