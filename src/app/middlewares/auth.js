import jwt from 'jsonwebtoken';
import { promisify } from 'util';

// Importa o md5 gerado
import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;
  /* Caso o token não esteja no cabeçalho da requição não haverá uma resposta
   * e a ação não será permitida, havendo uma mensagem de erro
   */
  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }
  // separa o token para a verificação posterior
  const [, token] = authHeader.split(' ');

  /* Verifica a integridade do token com o md5 criado para a aplicação do login
   * do id do usuário criado/logado, pela SessionController se tudo certo, ação
   * é permitida, se houver algo alterado o catch(err) tratará a
   *  informação como erro e barrará a ação
   * e retornará uma mensagem de erro.
   */
  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    req.userId = decoded.id;

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid' });
  }
};
