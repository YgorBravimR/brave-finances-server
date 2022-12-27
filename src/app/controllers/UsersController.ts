import { Request, Response } from 'express';
import * as Yup from 'yup';

import AppError from '../../errors/AppError';

import User from '../models/schemas/User';

import { CreateUserService } from '../../services/Users/CreateUserService';
import { UpdateUserInfoService } from '../../services/Users/UpdateUserInfoService';
import { UpdateUserAvatarService } from '../../services/Users/UpdateUserAvatarService';
import { DeleteUserService } from '../../services/Users/DeleteUserService';
import { getMongoRepository } from 'typeorm';
import ResponseSuccess from '../../libs/responseSuccess';

export default class UsersController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
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
        throw new Error('Error on validate mandatory informations');
      }

      const createUser = new CreateUserService();

      const user = await createUser.execute({
        fullname,
        email,
        password,
      });

      return res.json(new ResponseSuccess({ user }));
    } catch (error) {
      return res.json(new AppError('Failed when trying to create a user.', (error as Error).message));
    }
  }

  public async list(req: Request, res: Response): Promise<Response> {
    try {
      const usersRepository = getMongoRepository(User);

      const users = await usersRepository.find();

      return res.json(new ResponseSuccess({ users }));
    } catch (error) {
      return res.json(new AppError('Failed when trying to list users.', (error as Error).message));
    }
  }

  public async updateInfo(req: Request, res: Response): Promise<Response> {
    try {
      const { fullname, email, new_password, current_password } = req.body;

      const user_id = req.user.id;

      const schema = Yup.object().shape({
        fullname: Yup.string().required(),
        email: Yup.string().email(),
        current_password: Yup.string().required(),
        new_password: Yup.string()
          .required()
          .matches(/^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])/),
      });

      if (!(await schema.isValid({ fullname, email, new_password, user_id }))) {
        throw new Error('Error on validate mandatory informations');
      }

      const updateUserInfo = new UpdateUserInfoService();

      const updatedUser = await updateUserInfo.execute({
        user_id,
        fullname,
        email,
        new_password,
        current_password,
      });

      return res.json(new ResponseSuccess({ updatedUser }));
    } catch (error) {
      return res.json(new AppError('Failed when trying to update a user.', (error as Error).message));
    }
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
