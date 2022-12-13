import { getRepository } from 'typeorm';
import { User } from '../app/models/User';
import { AppError } from '../errors/AppError';

import * as Yup from 'yup';

interface IRequest {
  user_id: string;
  fullname: string;
  email: string;
  password: string;
}

class UpdateUserInfoService {
  public async execute({ user_id, fullname, email, password }: IRequest): Promise<User> {
    const usersRepository = getRepository(User);

    const schema = Yup.object().shape({
      fullname: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string()
        .required()
        .matches(/^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])/),
    });

    if (!(await schema.isValid({ fullname, email, password }))) {
      throw new AppError('Error on validate mandatory informations', 400);
    }

    const checkUserExists = await usersRepository.findOne({
      where: { email },
    });

    if (checkUserExists) {
      throw new AppError('Email address already used');
    }

    const user = await usersRepository.findOne(user_id);

    if (!user) {
      throw new AppError('Only authenticated users can change avatar', 401);
    }

    const updatedUser = { ...user, fullname, email, password };

    await usersRepository.save(updatedUser);

    return updatedUser;
  }
}

export { UpdateUserInfoService };
