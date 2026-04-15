import express from 'express';
import cors from 'cors';
import movieRoutes from './routes/movie';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/movies', movieRoutes);

app.use(errorHandler);

export default app;