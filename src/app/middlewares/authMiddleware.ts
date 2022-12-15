import { Response, Request, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { AppError } from '../../errors/AppError';
import authConfig from '../../config/auth';

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT Token is missing', 401);
  }

  const [, token] = authHeader.split(' ');

  const decoded = verify(token, authConfig.jwt.secret);

  const { sub } = decoded as ITokenPayload;

  req.user = {
    id: sub,
  };

  return next();
}
