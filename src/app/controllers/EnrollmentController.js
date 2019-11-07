import * as Yup from 'yup';
import { isBefore, parseISO, addMonths } from 'date-fns';
import Enrollment from '../models/Enrollment';
import Plans from '../models/Plans';
import Students from '../models/Students';
import Queue from '../../lib/Queue';
import EnrollmentedMail from '../jobs/enrollmentedMail';

class EnrollmentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });
    // Checks to validation schema
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Validation fails.',
      });
    }

    const { student_id, plan_id, start_date } = req.body;
    // Checks exist student in academy
    const student = await Students.findOne({ where: { id: student_id } });

    if (!student) {
      return res
        .status(400)
        .json({ error: "This student doesn't registration." });
    }

    const enrollmentStudentExist = await Enrollment.findOne({
      where: {
        student_id,
      },
    });

    // Checks exist enrollment student active

    if (enrollmentStudentExist) {
      return res
        .status(400)
        .json({ error: 'The student already registration.' });
    }

    // Checks exist plan
    const plan = await Plans.findByPk(plan_id);

    if (!plan) {
      return res
        .status(400)
        .json({ error: "This plan doesn't exist or has been removed" });
    }

    // Check currect date start
    const initialDate = parseISO(start_date);

    if (isBefore(initialDate, new Date())) {
      return res.status(400).json({ error: 'This date is not allowed' });
    }

    // Checks end date, calc price and returns the information of enrollment
    const end_date = addMonths(initialDate, plan.duration);
    const price = plan.price * plan.duration;

    const enrollmented = await Enrollment.create({
      student_id,
      start_date,
      end_date,
      plan_id,
      price,
    });

    // Send email to student
    const enrollmentedStudent = await Enrollment.findByPk(enrollmented.id, {
      include: [
        {
          model: Students,
          as: 'students',
          attributes: ['name', 'email'],
        },
        {
          model: Plans,
          as: 'plans',
          attributes: ['title', 'duration'],
        },
      ],
    });

    await Queue.add(EnrollmentedMail.key, {
      enrollmentedStudent,
    });
    return res.json(enrollmented);
  }

  // List in order id enrollments
  async index(req, res) {
    const enrollmented = await Enrollment.findAll({
      order: [['id', 'Desc']],
      attributes: ['id', 'start_date', 'end_date', 'plan_id', 'price'],
      include: [
        {
          model: Students,
          as: 'students',
          attributes: ['id', 'name', 'email', 'age', 'weight', 'height'],
        },
      ],
    });
    return res.json(enrollmented);
  }

  // Update enrollments
  async update(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });
    // Checks to validation schema
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Validation fails.',
      });
    }

    const { enrollmented_id } = req.params;
    const { plan_id, start_date, student_id } = req.body;

    // Checks if enrollment stundent exist
    const student = await Students.findByPk(student_id);

    if (!student) {
      return res.status(400).json({ error: 'This student not enrollmented' });
    }
    // Checks if plan exist
    const plan = await Plans.findByPk(plan_id);

    if (!plan) {
      return res
        .status(400)
        .json({ error: ' This plan not exists or removed.' });
    }
    // Checks if date is valid
    const initialDate = parseISO(start_date);

    if (isBefore(initialDate, new Date())) {
      return res.status(400).json({ error: 'This date is invalid' });
    }
    // Caculates the end date, price and returns enrollment updated
    const end_date = addMonths(initialDate, plan.duration);
    const price = plan.price * plan.duration;

    // Checks if enrollment exist
    const enrollment = await Enrollment.findByPk(enrollmented_id);

    if (!enrollment) {
      return res
        .status(400)
        .json({ error: ' This enrollment not exists or removed.' });
    }

    return res.json(
      await enrollment.update({
        student_id,
        start_date,
        end_date,
        plan_id,
        price,
      })
    );
  }

  // Delete enrollments
  async delete(req, res) {
    const { enrollmented_id } = req.params;

    const enrollment = await Enrollment.findByPk(enrollmented_id);

    if (!enrollment) {
      return res
        .status(400)
        .json({ error: ' This enrollment not exists or alredy deleted.' });
    }

    await enrollment.destroy(enrollmented_id);
    return res.json({
      error: `Student enrollment success deleted!`,
    });
  }
}

export default new EnrollmentController();
