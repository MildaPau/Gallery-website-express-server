import { Router } from 'express';
import multer from 'multer';
import {
  getSculptures,
  getSculpture,
  createSculpture,
  updateSculpture,
  deleteSculpture,
} from '../controllers/sculptures-controller';
import { authMiddleware } from '../middlewares/auth-middlewares';

// const upload = multer({ dest: 'public/uploads' });
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'public/uploads');
  },
  filename(req, file, cb) {
    const userPrefix = req.tokenData ? `${req.tokenData.email.split('@')[0]}-` : '';
    const uniqueSuffix = `${Date.now()}`;
    const ext = file.originalname.split('.').reverse()[0];
    cb(null, `${userPrefix}${file.fieldname}-${uniqueSuffix}.${ext}`);
  },
});

const upload = multer({ storage });
const sculpturesRouter = Router();

sculpturesRouter.get('/', getSculptures);
sculpturesRouter.get('/:id', getSculpture);
sculpturesRouter.post('/', authMiddleware, upload.single('image'), createSculpture);
sculpturesRouter.patch('/:id', authMiddleware, updateSculpture);
sculpturesRouter.delete('/:id', authMiddleware, deleteSculpture);

export default sculpturesRouter;
