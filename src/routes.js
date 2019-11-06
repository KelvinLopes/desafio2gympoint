import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import StudentsController from './app/controllers/StudentController';
import PlansController from './app/controllers/PlansController';
import EnrollmentController from './app/controllers/EnrollmentController';
import CheckinController from './app/controllers/CheckinController';

import autMiddleware from './app/middlewares/auth';

const routes = new Router();

// Login and session routes, user and student creation routes
routes.post('/sessions', SessionController.store);
routes.post('/users', UserController.store);
routes.post('/students', StudentsController.store);

// Routes for creating, editing, listing and removing academy plans
routes.post('/plans', PlansController.store);
routes.get('/plans', PlansController.index);

// Enrollments routes
routes.post('/enrollment', EnrollmentController.store);
routes.get('/enrollment', EnrollmentController.index);

// Checkins routes
routes.post('/checkins', CheckinController.store);
routes.get('/checkins/:student_id', CheckinController.index);

routes.use(autMiddleware);
// Editing routes: users, students, Plans, Enrollment
routes.put('/users', UserController.update);
routes.put('/students', StudentsController.update);
routes.put('/plans', PlansController.update);
routes.put('/enrollment/:enrollmented_id', EnrollmentController.update);

// Deleting routes
routes.delete('/plans/:id', PlansController.delete);
routes.delete('/enrollment/:enrollmented_id', EnrollmentController.delete);

export default routes;
