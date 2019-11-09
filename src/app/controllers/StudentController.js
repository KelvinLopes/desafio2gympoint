import * as Yup from 'yup';
import Student from '../models/Students';

// Inseri novos students
class StudentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().required(),
      age: Yup.number()
        .positive()
        .required(),
    });
    // Caso dado esteja diferente do schema acima, haverá uma mensagem de erro
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'The information you want to edit, does not exist, try again.',
      });
    }
    // Verifica se já existe um estudante cadastro através da propriedade e-mail
    const studentExists = await Student.findOne({
      where: { email: req.body.email },
    });
    // Caso o cadastro do estudante exista haverá uma mensagem de erro
    if (studentExists) {
      return res
        .status(400)
        .json({ error: ' Student with this email already exists.' });
    }
    // Se tudo certo haverá o retorno das informações cadastradas
    const { id, name, email, age, weight, height } = await Student.create(
      req.body
    );

    return res.json({
      id,
      name,
      email,
      age,
      weight,
      height,
    });
  }

  // Listar todos os alunos

  async index(req, res) {
    const { page = 1 } = req.query;

    const getStudents = await Student.findAll({
      order: [['id', 'asc']],

      limit: 10,
      offset: (page - 1) * 10,
      attributes: ['id', 'name', 'email', 'age', 'weight', 'height'],
    });

    if (!getStudents) {
      return res.status(400).json({
        error: 'You have no registered students yet.',
      });
    }

    return res.json(getStudents);
  }

  // Atualização de students
  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .required()
        .email(),
      age: Yup.number().positive(),
      weight: Yup.number().positive(),
      height: Yup.number().positive(),
    });
    // Caso dado esteja diferente do schema acima, haverá uma mensagem de erro
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'The information you want to edit, does not exist, try again.',
      });
    }
    // Precisa que o email esteja informado para atualização de dados
    const { email } = req.body;

    // Procura pelo e-mail informado
    const student = await Student.findOne({ where: { email } });

    // Se o cadastro do estudante não existe, haverá uma mensagem de erro
    if (!student) {
      return res.status(400).json({
        error:
          'Student not found our or there is no record with this information.',
      });
    }
    // Se tudo ok, as informações atualizadas serem exibidas
    const { name, age, weight, height } = await student.update(req.body);

    return res.json({
      name,
      email,
      age,
      weight,
      height,
    });
  }
}

export default new StudentController();
