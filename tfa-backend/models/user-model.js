const Sequelize = require("sequelize");
const sequelize = require("../utils/database");
const _ = require("lodash");
const UserRoles = require("./user-roles");

const User = sequelize.define("users", {
  userId: {
    primaryKey: true,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  phoneNumber: Sequelize.STRING,
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  tmpSecretToken: Sequelize.STRING,
  secretToken: Sequelize.STRING,
  accessToken: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  lastLogin: Sequelize.DATE,
});
User.prototype.toJSON = function () {
  const isTFAEnabled = this.get().secretToken ? true : false;
  const values = {
    ..._.omit(this.get(), [
      "password",
      "user_roles",
      "secretToken",
      "tmpSecretToken",
    ]),
  };
  if (this.get().user_roles && this.get().user_roles.length) {
    values["isTFAEnabled"] = isTFAEnabled;
    values.userRoles = this.get()
      .user_roles.map((role) => role.roleName)
      .toString();
  }
  return values;
};

User.hasMany(UserRoles, { foreignKey: "userId" });
UserRoles.belongsTo(User, { foreignKey: "userId" });
module.exports = User;
