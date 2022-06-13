import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';

type DecodedInfo = { email: string, role: 'admin' | 'user', iat?: number };

export const authMiddleware: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;
  try {
    if (authHeader === undefined) throw new Error('Reikalingas prisijungimas');

    const token = authHeader.split(' ')[1];
    if (token === undefined) throw new Error('Klaidingi vartotojo atpažinimo duomenys');

    const decodedInfo = jwt.verify(token, config.token.secret) as DecodedInfo;

    req.tokenData = {
      email: decodedInfo.email,
      role: decodedInfo.role,
    };

    next();
  } catch (error) {
    res.status(401).json({
      error: error instanceof Error ? error.message : 'Klaida atpažįstant vartotoją',
    });
  }
};
