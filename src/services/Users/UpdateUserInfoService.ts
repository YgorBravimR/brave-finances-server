import { hash } from 'bcryptjs';
import { getRepository } from 'typeorm';

import { User } from '../../app/models/User';
import { AppError } from '../../errors/AppError';

interface IRequest {
  user_id: string;
  fullname: string;
  email: string;
  new_password: string;
}

class UpdateUserInfoService {
  public async execute({ user_id, fullname, email, new_password }: IRequest): Promise<User> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne(user_id);

    if (!user) {
      throw new AppError('Only existing users can change avatar', 401);
    }

    const hashedNewPassword = await hash(new_password, 8);

    const updatedUser = { ...user, fullname, email, password: hashedNewPassword };

    await usersRepository.save(updatedUser);

    return updatedUser;
  }
}

export { UpdateUserInfoService };
