import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import { User } from '../../app/models/User';

interface IRequest {
  fullname: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ fullname, email, password }: IRequest): Promise<User> {
    const usersRepository = getRepository(User);

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
