import { Router } from 'express';
import { login, authenticate, checkEmail } from '../controllers/auth-controller';
import { authMiddleware } from '../middlewares/auth-middlewares';

const authRouter = Router();

authRouter.post('/login', login);
authRouter.post('/authenticate', authMiddleware, authenticate);
authRouter.get('/check-email', checkEmail);

export default authRouter;
