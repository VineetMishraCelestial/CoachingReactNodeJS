import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cron from 'node-cron';
import { config } from './config/index.js';
import routes from './routes/index.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';
import feeService from './services/feeService.js';
import userRepository from './repositories/userRepository.js';

const app = express();

app.use(helmet());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin']
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/v1/test-login', (req, res) => {
  console.log('Test login called:', req.body);
  res.json({ success: true, message: 'Test successful', data: req.body });
});

app.use('/api/v1', routes);

app.use(notFound);
app.use(errorHandler);

cron.schedule('0 0 1 * *', async () => {
  console.log('Running monthly fee generation cron job...');
  try {
    const institutes = await userRepository.findAllInstitutes();
    for (const institute of institutes) {
      await feeService.generateMonthlyFees(institute.id);
    }
    console.log('Monthly fees generated successfully');
  } catch (error) {
    console.error('Error generating monthly fees:', error);
  }
});

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${config.nodeEnv} mode`);
});

export default app;
