import { Request, Response } from 'express';

import * as Yup from 'yup';
import AppError from '../../errors/AppError';

import ResponseSuccess from '../../libs/responseSuccess';
import { getMongoRepository } from 'typeorm';
import { Category } from '../models/schemas/Category';
import { CreateCategoryService } from '../../services/Categories/CreateCategoryService';
import { UpdateCategoryService } from '../../services/Categories/UpdateCategoryService';

export default class CategoriesController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { name, color, code } = req.body;
      const user_id = req.user.id;

      const schema = Yup.object().shape({
        name: Yup.string().required(),
        code: Yup.string().required(),
        color: Yup.string().required(),
      });

      if (!(await schema.isValid({ name, color, code }))) {
        throw new Error('Error on validate mandatory information');
      }

      const createCategory = new CreateCategoryService();

      const category = await createCategory.execute({
        name,
        color,
        code,
        user_id,
      });
      return res.json(new ResponseSuccess({ category }));
    } catch (error) {
      return res.json(new AppError('Failed when trying to create a category.', (error as Error).message));
    }
  }

  public async list(req: Request, res: Response): Promise<Response> {
    try {
      const user_id = req.user.id;

      const categoryRepository = getMongoRepository(Category);
      const categories = await categoryRepository.find({
        where: { user_id },
      });

      return res.json(new ResponseSuccess({ categories }));
    } catch (error) {
      return res.json(new AppError('Failed when trying to list categories.', (error as Error).message));
    }
  }

  public async update(req: Request, res: Response): Promise<Response> {
    try {
      const user_id = req.user.id;

      const schema = Yup.object().shape({
        name: Yup.string(),
        code: Yup.string(),
        color: Yup.string(),
        category_id: Yup.string().required(),
      });

      if (!(await schema.isValid(req.body))) {
        throw new Error('Error on validate mandatory informations');
      }

      const updateCategoryService = new UpdateCategoryService();

      await updateCategoryService.execute({
        ...req.body,
        user_id,
      });

      return res.json(new ResponseSuccess({ message: 'Category updated successfully' }));
    } catch (error) {
      return res.json(new AppError('Failed when trying to update a category.', (error as Error).message));
    }
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { category_id } = req.body;

      const schema = Yup.object().shape({
        category_id: Yup.string().required(),
      });

      if (!(await schema.isValid(req.body))) {
        throw new Error('Error on validate mandatory informations');
      }

      const categoriesRepository = getMongoRepository(Category);

      const category = await categoriesRepository.findOne(category_id);

      if (!category) {
        throw new Error('Do not possibly delete');
      }

      await categoriesRepository.remove(category);

      return res.json(new ResponseSuccess({ message: 'Category deleted successfully' }));
    } catch (error) {
      return res.json(new AppError('Failed when trying to delete a category.', (error as Error).message));
    }
  }
}
