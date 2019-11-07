import Mail from '../../lib/answerMail';

// Load configs to AnswerHelpOrderController and send email

class AnswerMail {
  get key() {
    return 'AnswerMail';
  }

  // Configs of email

  async handle({ data }) {
    const sendanswer = data.answered;

    await Mail.sendMail({
      to: `${sendanswer.students.name} <${sendanswer.students.email}>`,
      subject: 'Answer to your help request',
      template: 'answers',
      context: {
        name: sendanswer.students.name,
        question: sendanswer.question,
        question_create: sendanswer.createdAt,
        answer: sendanswer.answer,
        date: sendanswer.answer_at,
      },
    });
  }
}

export default new AnswerMail();
