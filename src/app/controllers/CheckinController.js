import { subDays, startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';
import Checkins from '../models/Checkin';
import Students from '../models/Students';

class CheckinController {
  async store(req, res) {
    const { student_id } = req.body;
    const student = await Students.findOne({ where: { id: student_id } });

    // Checks to validation studant
    if (!student) {
      return res.status(400).json({ error: 'This student not enrollmented.' });
    }

    // Current date
    const checkinNow = Number(new Date());
    const amountDateCheckin = Number(subDays(checkinNow, 7));
    const maxCheckin = await Checkins.findAll({
      where: {
        student_id,
        created_at: {
          [Op.between]: [startOfDay(amountDateCheckin), endOfDay(checkinNow)],
        },
      },
    });

    if (maxCheckin.length >= 5) {
      return res
        .status(401)
        .json({ error: 'You can do 5(five) check-ins for week.' });
    }

    const countCheckins = await Checkins.create({ student_id });
    return res.json(countCheckins);
  }

  async index(req, res) {
    const { student_id } = req.params;
    const student = await Students.findOne({ where: { id: student_id } });

    // Checks to validation studant
    if (!student) {
      return res.status(400).json({ error: 'This student not enrollmented.' });
    }

    const checkins = await Checkins.findAll({
      where: { student_id },
    });
    return res.json(checkins);
  }
}

export default new CheckinController();
