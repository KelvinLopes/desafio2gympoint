import * as Yup from 'yup';
import HelpOrder from '../models/HelpOrders';
import Students from '../models/Students';

class AnswerHelpController {
  async store(req, res) {
    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });
    // Checks to validation schema
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Validation fails.',
      });
    }

    const { searchHelpOrder_id } = req.params;

    const searchHelpOrders = await HelpOrder.findByPk(searchHelpOrder_id, {
      include: [
        {
          model: Students,
          as: 'students',
          attributes: ['name', 'email'],
        },
      ],
    });

    if (!searchHelpOrders || searchHelpOrders.answer_at !== null) {
      return res
        .status(400)
        .json({ error: 'This help order already gone answered.' });
    }

    const answered = await searchHelpOrders.update({
      answer: req.body.answer,
      answer_at: new Date(),
    });

    return res.json(answered);
  }
}

export default new AnswerHelpController();
