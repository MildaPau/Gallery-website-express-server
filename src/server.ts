import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import cors from 'cors';
import sculpturesRouter from './routers/sculpture-router';
import categoriesRouter from './routers/categories-router';
import authRouther from './routers/auth-router';
import config from './config';
import CardsRouter from './routers/card-router';

const server = express();

// Middlewares
server.use(cors()); // Leidžia bendrauti su visais
server.use(morgan(':method :url :status'));
server.use(express.static('public'));
server.use(express.json());
server.use('/api/cards', CardsRouter);
server.use('/api/sculptures', sculpturesRouter);
server.use('/api/categories', categoriesRouter);
server.use('/api/auth', authRouther);

mongoose.connect(
  config.db.connectionUrl,
  {
    retryWrites: true,
    w: 'majority',
  },
  (error) => {
    if (error) {
      console.log(`Nepavyko Prisijungti:\n${error.message}`);
      return;
    }
    console.log('Successfully connected to MongoDB');
    server.listen(1337, () => console.log('Application server is running on: http://localhost:1337'));
  },
);
