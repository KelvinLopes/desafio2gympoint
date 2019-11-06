import Sequelize from 'sequelize';
import User from '../app/models/User';

import databaseConfig from '../config/database';

import Students from '../app/models/Students';

import Plans from '../app/models/Plans';

import Enrollment from '../app/models/Enrollment';

import Checkin from '../app/models/Checkin';

import HelpOrders from '../app/models/HelpOrders';

const models = [Students, User, Plans, Enrollment, Checkin, HelpOrders];

class Database {
  constructor() {
    this.init();
  }

  // Faz a conexão com a base de dados e exporta os models
  init() {
    this.connection = new Sequelize(databaseConfig);
    models.map(model => model.init(this.connection));

    models.map(
      model => model.associate && model.associate(this.connection.models)
    );
  }
}

export default new Database();
