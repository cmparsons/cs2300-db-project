import Sequelize from 'sequelize';

const sequelize = new Sequelize('test', 'postgres', 'postgres', {
  dialect: 'postgres',
  operatorsAliases: Sequelize.Op,
});

const models = {
  User: sequelize.import('./user'),
  Task: sequelize.import('./task'),
};

Object.keys(models).forEach((modelName) => {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;
