import * as Yup from 'yup';
import HelpOrder from '../models/HelpOrders';
import Students from '../models/Students';

class HelpOrderController {
  // Create help orders
  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });
    // Checks to validation schema
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Validation fails.',
      });
    }
    const { student_id } = req.params;
    const { question } = req.body;

    const student = await Students.findByPk(student_id);

    if (!student) {
      return res.status(400).json({ error: 'This student not enrollment.' });
    }

    const createHelpOrder = await HelpOrder.create({ student_id, question });

    return res.json(createHelpOrder);
  }

  // List help orders
  async index(req, res) {
    const { student_id } = req.params;
    const student = await Students.findByPk(student_id);

    if (!student) {
      return res.status(400).json({ error: 'This student not enrollment.' });
    }

    const listHelpOrders = await HelpOrder.findAll({
      where: {
        answer_at: null,
      },
    });
    return res.json(listHelpOrders);
  }
}

export default new HelpOrderController();
