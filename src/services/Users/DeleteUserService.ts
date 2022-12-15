import { compare } from 'bcryptjs';
import { getRepository } from 'typeorm';
import { User } from '../../app/models/User';

interface IRequest {
  user_id: string;
  password: string;
}

class DeleteUserService {
  public async execute({ user_id, password }: IRequest): Promise<void> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne(user_id);

    if (!user) {
      throw new Error('User not found');
    }

    const passwordMatches = await compare(password, user.password);

    if (!passwordMatches) {
      throw new Error('Password is incorrect');
    }

    usersRepository.remove(user);
  }
}

export { DeleteUserService };
