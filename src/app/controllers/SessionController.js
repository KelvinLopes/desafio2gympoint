import jwt from 'jsonwebtoken';

import * as Yup from 'yup';

import User from '../models/User';
import authConfig from '../../config/auth';

// Yup requer email e senha para login

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });
    /*
     *Se as informações forem distintas do schema acima, a validação dos dados
     *não aconterá e não haverá login
     */
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    // Requer que o email e senha sejam informados para o login
    const { email, password } = req.body;

    // Aguarda o preenchimento do email e senha informados
    const user = await User.findOne({ where: { email } });
    /* Se o o cadastro do usuário não existir, haverá mensagem de erro e não
     *haverá login
     */
    if (!user) {
      return res.status(401).json({ error: ' User not found' });
    }
    // Senha diferente da cadastrada, haverá mensagem de erro e não havera login
    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    // Informações tratadas do user são a id e o nome
    const { id, name } = user;

    return res.json({
      User: {
        id,
        name,
        email,
      },
      // Gera o token de autenticação para o usuário
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
