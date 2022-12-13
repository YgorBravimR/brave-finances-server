import { Router } from 'express';

import { CreateUserService } from '../services/CreateUserService';
import { UpdateUserInfoService } from '../services/UpdateUserInfoService';

import ensureAuthenticated from '../app/middlewares/ensureAuthenticated';
import { DeleteUserService } from '../services/DeleteUserService';
import { getRepository } from 'typeorm';
import { User } from '../app/models/User';
import uploadConfig from '../config/upload';
import multer from 'multer';
import { UpdateUserAvatarService } from '../services/UpdateUserAvatarService';

const usersRouter = Router();

const upload = multer(uploadConfig);

usersRouter.post('/', async (req, res) => {
  const { fullname, email, password } = req.body;

  const createUser = new CreateUserService();

  const user = await createUser.execute({
    fullname,
    email,
    password,
  });

  return res.json(user);
});

usersRouter.get('/', async (req, res) => {
  const usersRepository = await getRepository(User);

  const users = await usersRepository.find();

  res.json(users);
});

usersRouter.put('/', ensureAuthenticated, async (req, res) => {
  const { fullname, email, password, user_id } = req.body;
  // const { user_id } = req.query;

  const updateUserInfo = new UpdateUserInfoService();

  const updatedUser = await updateUserInfo.execute({
    user_id,
    fullname,
    email,
    password,
  });

  return res.json(updatedUser);
});

usersRouter.patch('/avatar', ensureAuthenticated, upload.single('avatar'), async (req, res) => {
  const updateUserAvatar = new UpdateUserAvatarService();

  if (!req.file) {
    throw new Error('File is undefined');
  }

  const user = await updateUserAvatar.execute({
    user_id: req.user.id,
    avatarFilename: req.file.filename,
  });

  return res.json({ user });
});

usersRouter.delete('/', ensureAuthenticated, async (req, res) => {
  const { password, user_id } = req.body;

  new DeleteUserService().execute({
    user_id,
    password,
  });

  return res.json({ success: `User com id: ${user_id} -> deleted succesfully` });
});
export { usersRouter };
