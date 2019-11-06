import Sequelize, { Model } from 'sequelize';

class HelpOrders extends Model {
  static init(sequelize) {
    super.init(
      {
        student_id: Sequelize.INTEGER,
        question: Sequelize.STRING,
        answer: Sequelize.STRING,
        answer_at: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  // Associate from model Students for Help Orders
  static associate(models) {
    this.belongsTo(models.Students, {
      foreignKey: 'student_id',
      as: 'students',
    });
  }
}

export default HelpOrders;
