import { Router } from 'express';
import {
  getCards,
  getCard,
  createCard,
  updateCard,
  deleteCard,
} from '../controllers/cards-controller';
import { authMiddleware } from '../middlewares/auth-middlewares';

const CardsRouter = Router();

CardsRouter.get('/', getCards);
CardsRouter.get('/:id', getCard);
CardsRouter.post('/', authMiddleware, createCard);
CardsRouter.patch('/:id', authMiddleware, updateCard);
CardsRouter.delete('/:id', authMiddleware, deleteCard);

export default CardsRouter;
