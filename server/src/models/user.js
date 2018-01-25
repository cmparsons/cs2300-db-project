export default (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    username: DataTypes.STRING,
  });

  User.associate = (models) => {
    models.User.hasMany(models.Task);
  };

  return User;
};
