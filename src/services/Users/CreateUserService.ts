import { getMongoRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import User from '../../app/models/schemas/User';

interface IRequest {
  fullname: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ fullname, email, password }: IRequest): Promise<User> {
    const usersRepository = getMongoRepository(User);

    const checkUserExists = await usersRepository.findOne({ where: { email } });

    if (checkUserExists) {
      throw new Error('Email address already used');
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
