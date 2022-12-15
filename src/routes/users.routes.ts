import { Router } from 'express';

import uploadConfig from '../config/upload';
import multer from 'multer';
import authMiddleware from '../app/middlewares/authMiddleware';

import UsersController from '../app/controllers/UsersController';

const usersRouter = Router();

const upload = multer(uploadConfig);

const usersController = new UsersController();

usersRouter.post('/', usersController.create);
usersRouter.get('/', usersController.list);

usersRouter.use(authMiddleware);

usersRouter.put('/', usersController.updateInfo);
usersRouter.patch('/avatar', upload.single('avatar'), usersController.updateAvatar);
usersRouter.delete('/', usersController.delete);

export { usersRouter };
