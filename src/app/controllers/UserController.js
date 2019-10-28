import * as Yup from 'yup';
import User from '../models/User';

// Inserir users
class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });
    /* Caso alguma informação estiver diferente do schema acima,
     *haverá uma mensagem de erro
     */
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    // Procura por um e-mail existente que foi informado
    const userExist = await User.findOne({ where: { email: req.body.email } });

    // Se o cadastro já existir, haverá uma mensagem de erro
    if (userExist) {
      return res.status(400).json({ error: ' User already exists.' });
    }

    // Se for um novo cadastro, as informações serão redenrizadas
    const { id, name, email } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }

  // Atulizações dos users
  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string().when('oldPassword', (oldPassword, field) =>
        oldPassword ? field.required() : field
      ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });
    /* Caso alguma informação estiver diferente do schema acima,
     *haverá uma mensagem de erro
     */
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    // Para alterar a senha, deve ter um email, e a senha antiga
    const { email, oldPassword } = req.body;

    // Procura o cadastro pela primaryKey da Id do usuário
    const user = await User.findByPk(req.userId);

    // Valida o e-mail informado com o email já cadastrado

    if (email !== user.email) {
      const userExist = await User.findOne({
        where: { email },
      });

      if (userExist) {
        return res.status(400).json({ error: 'User already exists' });
      }
    }

    /* Aguarda a digitação da senha antiga e verifica se elas combinam
     *caso não, haverá uma mensagem de erro e não permite a edição da mesma
     */
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res
        .status(401)
        .json({ error: 'Password does not combine, try again' });
    }
    // Se tudo certo, as novas informações serão redenrizadas
    const { id, name } = await user.update(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }
}

export default new UserController();
