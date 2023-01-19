import { compare, hash } from 'bcryptjs';
import { getMongoRepository } from 'typeorm';
import User from '../../app/models/schemas/User';

interface IRequest {
  user_id: string;
  fullname: string;
  email: string;
  new_password: string;
  current_password: string;
}

class UpdateUserInfoService {
  public async execute({ user_id, fullname, email, new_password, current_password }: IRequest): Promise<User> {
    const usersRepository = getMongoRepository(User);

    const user = await usersRepository.findOne(user_id);

    if (!user) {
      throw new Error('This user does not exist');
    }

    const passwordMatched = await compare(current_password, user.password);

    if (!passwordMatched) {
      throw new Error('Password is incorrect');
    }

    const hashedNewPassword = await hash(new_password, 8);

    const updatedUser = { ...user, fullname, email, password: hashedNewPassword };

    await usersRepository.save(updatedUser);

    return updatedUser;
  }
}

export { UpdateUserInfoService };
