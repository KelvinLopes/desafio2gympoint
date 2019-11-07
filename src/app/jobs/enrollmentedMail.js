import { format, parseISO } from 'date-fns';
import Mail from '../../lib/Mail';

// Load configs to EnrrollmentController and send email

class EnrollmentedMail {
  get key() {
    return 'EnrollmentedMail';
  }

  // Configs of email

  async handle({ data }) {
    const enrollmented = data.enrollmentedStudent;

    await Mail.sendMail({
      to: `${enrollmented.students.name} <${enrollmented.students.email}>`,
      subject: 'Welcame to the Gympoint family',
      template: 'enrollmented',
      context: {
        name: enrollmented.students.name,
        start_date: format(
          parseISO(enrollmented.start_date),
          "MM'/'dd'/'yyyy'"
        ),
        plan_title: enrollmented.plans.title,
        plan_duration: enrollmented.plans.duration,
        price: enrollmented.price,
        end_date: format(parseISO(enrollmented.end_date), "MM'/'dd'/'yyyy'"),
      },
    });
  }
}

export default new EnrollmentedMail();
