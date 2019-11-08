
# Api para cadastro de alunos 🎓 🚀- Desafio 2 Rocketseat 

Foi utilizado:

* Express,
* NodeJS,
* Docker,
* Sucrase,
* Nodemon,
* ESLint,
* Prettier,
* EditorConfig,
* Redis,
* Sequelize com o PostgreSQL,
* Sentry, para auxiliar gerenciar nas tratativas de erros em ambiente de produção,
* Youch, para auxiliar na tratativas de erros no ambiente de desenvolvimento 
* JWT,para autenticação com produção de token,
* Express Handlebars e nodemailer-express-handlebars, para utilizar templates de email handlebarsjs.
* Bee-queue, que administra filas dos processos, por exemplo auxiliar nos envios dos emails.
* Nodemail, para enviar emails para alunos
* Yup para construtução de schemas de validação.

É possível inserir informações dos estudantes, atualizá las, criar e editar planos para a academia,mas apenas o usuário admin pode ter esse privilégio.
Agora é póssivel listar todos os planos que se cria, todas as matrículas dos alunos. Além de gerar matriculas em planos, é possível edita las e exclui las, controlar check ins, o máximo é 5 por semana. Alunos tiram dúvidas via app e recebem suporte via email, quando um aluno(a) se cadastra em um novo plano, este(a) recebe um email com todas as informações dele e com uma mensagem de saudação.

É preciso usar o Insomnia ou outro rest-cli  para testes.
