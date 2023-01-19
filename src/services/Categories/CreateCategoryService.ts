import { getMongoRepository } from 'typeorm';
import { Category } from '../../app/models/schemas/Category';
import User from '../../app/models/schemas/User';

interface IRequest {
  name: string;
  code: string;
  color: string;
  user_id: string;
}

class CreateCategoryService {
  public async execute({ name, color, code, user_id }: IRequest): Promise<Category> {
    const usersRepository = getMongoRepository(User);
    const checkUserExists = await usersRepository.findOne(user_id);

    if (!checkUserExists) {
      throw new Error('User do not exist');
    }

    const categoriesRepository = getMongoRepository(Category);

    const checkCategoryExists = await categoriesRepository.findOne({
      where: {
        code,
      },
    });

    if (checkCategoryExists) {
      throw new Error('Category already exists with this code');
    }

    const category = categoriesRepository.create({
      name,
      color,
      code,
      user_id,
    });

    await categoriesRepository.save(category);

    return category;
  }
}

export { CreateCategoryService };
