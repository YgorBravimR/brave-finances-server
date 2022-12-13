import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import { AppError } from '../errors/AppError';
import { User } from '../app/models/User';
import * as Yup from 'yup';

interface IRequest {
  fullname: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ fullname, email, password }: IRequest): Promise<User> {
    const usersRepository = getRepository(User);

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

    const checkUserExists = await usersRepository.findOne({ where: { email } });

    if (checkUserExists) {
      throw new AppError('Email address already used');
    }

    const hashedPassword = await hash(password, 8);

    const user = usersRepository.create({
      fullname,
      email,
      password: hashedPassword,
    });

    await usersRepository.save(user);

    return user;
  }
}

export { CreateUserService };
