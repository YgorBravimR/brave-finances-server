import 'reflect-metadata';
import { JSONCookie } from 'cookie-parser';
import 'express-async-errors';
import './database';
import cors from 'cors';

import express, { NextFunction, Response, Request } from 'express';
import { routes } from './routes';
import uploadConfig from './config/upload';
import { AppError } from './errors/AppError';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.directory));
app.use(routes);
app.use(JSONCookie);

app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  console.error(err);

  return res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
});

app.listen(3333, () => console.log('Server is running FAST on port 3333'));
