import { Request, Response } from 'express';
import * as Yup from 'yup';

import AppError from '../../errors/AppError';
import ResponseSuccess from '../../libs/responseSuccess';

import { AuthenticateUserService } from '../../services/Users/AuthenticateUserService';

export default class UsersController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;

      const schema = Yup.object().shape({
        email: Yup.string().email().required(),
        password: Yup.string()
          .required()
          //Must Contain 8 Char, 1 Uppercase, 1 Lowercase, 1 Number and 1 Special Case Char
          .matches(/^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])/),
      });

      if (!(await schema.isValid({ email, password }))) {
        throw new Error('Error on validate mandatory informations');
      }

      const authenticateUser = new AuthenticateUserService();

      const { user, token } = await authenticateUser.execute({
        email,
        password,
      });

      const userWithoutPassword = {
        id: user.id,
        fullname: user.fullname,
        avatar: user.avatar,
        email: user.email,
        created_at: user.created_at,
        updated_at: user.updated_at,
      };

      return res.json(new ResponseSuccess({ user: userWithoutPassword, token }));
    } catch (error) {
      return res.json(new AppError('Failed when trying to create a session.', (error as Error).message));
    }
  }
}
