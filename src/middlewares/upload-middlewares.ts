import multer from 'multer';

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

export const singleUploadMiddleware = (key: string) => upload.single(key);
