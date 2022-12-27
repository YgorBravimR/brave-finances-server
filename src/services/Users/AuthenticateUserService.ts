import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { getMongoRepository } from 'typeorm';
import User from '../../app/models/schemas/User';
import authConfig from '../../config/auth';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: User;
  token: string;
}

class AuthenticateUserService {
  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const usersRepository = getMongoRepository(User);

    const user = await usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new Error('Incorrect email/password combination');
    }

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new Error('Incorrect email/password combination');
    }
    const { secret, expiresIn } = authConfig.jwt;
    const token = sign({}, secret, {
      expiresIn,
      subject: String(user.id),
    });

    return { user, token };
  }
}

export { AuthenticateUserService };
