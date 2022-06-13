import { Router } from 'express';
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categories-controller';
import { authMiddleware } from '../middlewares/auth-middlewares';

const categoriesRouter = Router();

categoriesRouter.get('/', getCategories);
categoriesRouter.get('/:id', getCategory);
categoriesRouter.post('/', authMiddleware, createCategory);
categoriesRouter.patch('/:id', authMiddleware, updateCategory);
categoriesRouter.delete('/:id', authMiddleware, deleteCategory);

export default categoriesRouter;
