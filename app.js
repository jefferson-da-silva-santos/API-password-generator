import express from 'express';
import 'dotenv/config';
import passwordRouter from './routes/passwordRoutes.js';
import authRouter from './routes/authRoutes.js';
import errorHandler from './middlewares/errorHandler.js';
import morgan from 'morgan';
import logger from './utils/logger.js';

const app = express();

// Configuração do Morgan para logar requisições HTTP
app.use(morgan('combined', { stream: { write: msg => logger.info(msg.trim()) } }));

app.use(express.json());
app.use('/password', passwordRouter);
app.use('/auth', authRouter)
// Middleware de tratamento de erros
app.use(errorHandler)

app.listen(3000, () => {
  logger.info('A API subiu com sucesso.')
  console.log('A API subiu com sucesso!!');
});

