import express from 'express';
import routes from './routes';
import './database';

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
  }

  // Permite ou não uma ação
  middlewares() {
    this.server.use(express.json());
  }

  // Rotas da api
  routes() {
    this.server.use(routes);
  }
}
export default new App().server;
