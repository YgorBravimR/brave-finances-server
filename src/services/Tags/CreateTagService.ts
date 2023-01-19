import { getMongoRepository } from 'typeorm';
import { Tag } from '../../app/models/schemas/Tag';
import User from '../../app/models/schemas/User';

interface IRequest {
  name: string;
  code: string;
  user_id: string;
}

class CreateTagService {
  public async execute({ name, code, user_id }: IRequest): Promise<Tag> {
    const usersRepository = getMongoRepository(User);
    const checkUserExists = await usersRepository.findOne(user_id);

    if (!checkUserExists) {
      throw new Error('User do not exist');
    }

    const tagsRepository = getMongoRepository(Tag);

    const checkTagExists = await tagsRepository.findOne({
      where: {
        code,
      },
    });

    if (checkTagExists) {
      throw new Error('Tag already exists with this code');
    }

    const tag = tagsRepository.create({
      name,
      code,
      user_id,
    });

    await tagsRepository.save(tag);

    return tag;
  }
}

export { CreateTagService };
