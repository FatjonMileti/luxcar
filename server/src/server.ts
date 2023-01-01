import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { config } from './config';
import carsRouter from './routes/cars';
import inquiriesRouter from './routes/inquiries';

const app = express();
app.use(cors({ origin: config.clientUrl }));
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ ok: true, app: 'LuxCar MERN' }));
app.use('/api/cars', carsRouter);
app.use('/api/inquiries', inquiriesRouter);

mongoose
  .connect(config.mongoUri)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(config.port, () =>
      console.log(`LuxCar API running on http://localhost:${config.port}`)
    );
  })
  .catch((err: unknown) => {
    console.error('Mongo connection error:', err instanceof Error ? err.message : err);
    process.exit(1);
  });
