export default (sequelize, DataTypes) => {
  const Task = sequelize.define('task', {
    title: DataTypes.STRING,
  });

  Task.associate = (models) => {
    models.Task.belongsTo(models.User, {
      onDelete: 'CASCADE',
      foreignKey: {
        allowNull: false,
      },
    });
  };

  return Task;
};
