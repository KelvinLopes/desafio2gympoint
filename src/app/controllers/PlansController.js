import * as Yup from 'yup';
import Plans from '../models/Plans';

class PlansController {
  // Cadastro de novos planos
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string()
        .uppercase()
        .required(),
      duration: Yup.number()
        .positive()
        .integer()
        .required(),
      price: Yup.number()
        .positive()
        .required(),
    });
    // Check to validation schema
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error:
          'You must enter a name, duration, and price for the plan you want to create.',
      });
    }
    // Check if plan exist
    const checkPlanExist = await Plans.findOne({
      where: { title: req.body.title },
    });

    if (checkPlanExist) {
      return res.status(400).json({
        error: 'There is already a plan with that name.',
      });
    }
    // Return new plan
    const { title, duration, price } = await Plans.create(req.body);

    return res.json({
      title,
      duration,
      price,
    });
  }

  // List in order of title creation
  async index(req, res) {
    const plans = await Plans.findAll({
      order: [['title', 'Desc']],
    });
    return res.json(plans);
  }

  // Update of plans
  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string()
        .uppercase()
        .required(),
      duration: Yup.number()
        .positive()
        .integer()
        .required(),
      price: Yup.number()
        .positive()
        .required(),
    });
    // Check to validation schema
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Validation failed.',
      });
    }
    // Check if plan exist
    const checkPlanExist = await Plans.findOne({
      where: { title: req.body.title },
    });

    if (!checkPlanExist) {
      return res.status(400).json({
        error: 'This plan does not exist.',
      });
    }
    // To Update enter the name of the plan
    const { title } = await req.body;
    const plan = await Plans.findOne({ where: { title } });
    // Returns the update
    const { duration, price } = await plan.update(req.body);

    return res.json({
      title,
      duration,
      price,
    });
  }

  async delete(req, res) {
    // Check if plan exist

    const checkPlanExistAndDelete = await Plans.destroy({
      where: { id: req.params.id },
    });

    if (!checkPlanExistAndDelete) {
      return res.status(400).json({
        error: 'This plan does not exist our already deleted.',
      });
    }
    // Returns the delete mensage
    return res.json({ message: 'The plan success deleted.' });
  }
}

export default new PlansController();
