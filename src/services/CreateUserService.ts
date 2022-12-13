import { getRepository } from 'typeorm';
import { User } from '../app/models/User';
import { hash } from 'bcryptjs';
import { AppError } from '../errors/AppError';

interface IRequest {
  fullname: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ fullname, email, password }: IRequest): Promise<User> {
    const usersRepository = getRepository(User);

    const checkUserExists = await usersRepository.findOne({
      where: { email },
    });

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
