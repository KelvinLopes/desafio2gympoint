import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import StudentsController from './app/controllers/StudentController';

import autMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/sessions', SessionController.store);
routes.post('/users', UserController.store);
routes.post('/students', StudentsController.store);

routes.use(autMiddleware);

export default routes;
