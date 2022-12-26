import { getMongoRepository } from 'typeorm';
import { Category } from '../../app/models/schemas/Category';

interface IRequest {
  name?: string;
  code?: string;
  color?: string;
  category_id: string;
}

class UpdateCategoryService {
  public async execute(categoryChanges: IRequest): Promise<void> {
    const categoryRepository = getMongoRepository(Category);

    const { category_id } = categoryChanges;

    const category = await categoryRepository.findOne(category_id);
    if (!category) {
      throw new Error('Category not found');
    }

    await categoryRepository.update(
      {
        id: category.id,
      },
      categoryChanges,
    );

    return;
  }
}

export { UpdateCategoryService };
