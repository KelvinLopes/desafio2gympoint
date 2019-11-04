import Sequelize from 'sequelize';
import User from '../app/models/User';

import databaseConfig from '../config/database';

import Students from '../app/models/Students';

import Plans from '../app/models/Plans';

const models = [Students, User, Plans];

class Database {
  constructor() {
    this.init();
  }

  // Faz a conexão com a base de dados e exporta os models
  init() {
    this.connection = new Sequelize(databaseConfig);
    models.map(model => model.init(this.connection));
  }
}

export default new Database(databaseConfig);
