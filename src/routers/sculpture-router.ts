import { Router } from 'express';
import {
  getSculptures,
  getSculpture,
  createSculpture,
  updateSculpture,
  deleteSculpture,
} from '../controllers/sculptures-controller';
import { authMiddleware } from '../middlewares/auth-middlewares';

const sculpturesRouter = Router();

sculpturesRouter.get('/', getSculptures);
sculpturesRouter.get('/:id', getSculpture);
sculpturesRouter.post('/', authMiddleware, createSculpture);
sculpturesRouter.patch('/:id', authMiddleware, updateSculpture);
sculpturesRouter.delete('/:id', authMiddleware, deleteSculpture);

export default sculpturesRouter;
