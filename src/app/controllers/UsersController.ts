import { Request, Response } from 'express';
import * as Yup from 'yup';
import { getRepository } from 'typeorm';

import { AppError } from '../../errors/AppError';
import { User } from '../models/User';
import { CreateUserService } from '../../services/Users/CreateUserService';
import { UpdateUserInfoService } from '../../services/Users/UpdateUserInfoService';
import { compare } from 'bcryptjs';
import { UpdateUserAvatarService } from '../../services/Users/UpdateUserAvatarService';
import { DeleteUserService } from '../../services/Users/DeleteUserService';

export default class UsersController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { fullname, email, password } = req.body;

    const schema = Yup.object().shape({
      fullname: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string()
        .required()
        //Must Contain 8 Char, 1 Uppercase, 1 Lowercase, 1 Number and 1 Special Case Char
        .matches(/^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])/),
    });

    if (!(await schema.isValid({ fullname, email, password }))) {
      throw new AppError('Error on validate mandatory informations', 400);
    }

    const usersRepository = getRepository(User);

    const checkUserExists = await usersRepository.findOne({ where: { email } });

    if (checkUserExists) {
      throw new AppError('Email address already used');
    }

    const createUser = new CreateUserService();

    const user = await createUser.execute({
      fullname,
      email,
      password,
    });

    return res.json(user);
  }

  public async list(req: Request, res: Response): Promise<Response> {
    const usersRepository = getRepository(User);

    const users = await usersRepository.find();

    return res.json(users);
  }

  public async updateInfo(req: Request, res: Response): Promise<Response> {
    const { fullname, email, new_password, current_password } = req.body;

    const user_id = req.user.id;

    const schema = Yup.object().shape({
      fullname: Yup.string().required(),
      email: Yup.string().email(),
      user_id: Yup.string().required(),
      new_password: Yup.string()
        .required()
        .matches(/^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])/),
    });

    if (!(await schema.isValid({ fullname, email, new_password, user_id }))) {
      throw new AppError('Error on validate mandatory informations', 400);
    }

    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne(user_id);

    console.log(user);

    if (!user) {
      throw new AppError('This user does not exist');
    }

    const passwordMatched = await compare(current_password, user.password);

    if (!passwordMatched) {
      throw new AppError('Password is incorrect');
    }

    const updateUserInfo = new UpdateUserInfoService();

    const updatedUser = await updateUserInfo.execute({
      user_id,
      fullname,
      email,
      new_password,
    });

    return res.json(updatedUser);
  }

  public async updateAvatar(req: Request, res: Response): Promise<Response> {
    const updateUserAvatar = new UpdateUserAvatarService();

    if (!req.file) {
      throw new Error('File is undefined');
    }

    const user = await updateUserAvatar.execute({
      user_id: req.user.id,
      avatarFilename: req.file.filename,
    });

    return res.json({ user });
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const { password } = req.body;

    const user_id = req.user.id;

    new DeleteUserService().execute({
      user_id,
      password,
    });

    return res.json({ success: `User com id: ${user_id} -> deleted succesfully` });
  }
}
