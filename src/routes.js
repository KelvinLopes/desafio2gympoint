import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import StudentsController from './app/controllers/StudentController';
import PlansController from './app/controllers/PlansController';

import autMiddleware from './app/middlewares/auth';

const routes = new Router();

// Rotas de login = /sessions e rotas de criação de user e students
routes.post('/sessions', SessionController.store);
routes.post('/users', UserController.store);
routes.post('/students', StudentsController.store);

// Rotas para criar, editar, listar e remover planos Gympont
routes.post('/plans', PlansController.store);
routes.get('/plans', PlansController.index);

routes.use(autMiddleware);
// Rotas de edição users, students, Plans
routes.put('/users', UserController.update);
routes.put('/students', StudentsController.update);
routes.put('/plans', PlansController.update);

// Routas que deletam
routes.delete('/plans/:id', PlansController.delete);

export default routes;
