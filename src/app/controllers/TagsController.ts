import { Request, Response } from 'express';

import * as Yup from 'yup';
import AppError from '../../errors/AppError';

import ResponseSuccess from '../../libs/responseSuccess';
import { getMongoRepository } from 'typeorm';
import { Tag } from '../models/schemas/Tag';
import { CreateTagService } from '../../services/Tags/CreateTagService';
import { UpdateTagService } from '../../services/Tags/UpdateTagService';

export default class TagsController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { name, code } = req.body;
      const user_id = req.user.id;

      const schema = Yup.object().shape({
        name: Yup.string().required(),
        code: Yup.string().required(),
      });

      if (!(await schema.isValid({ name, code }))) {
        throw new Error('Error on validate mandatory information');
      }

      const createTag = new CreateTagService();

      const tag = await createTag.execute({
        name,
        code,
        user_id,
      });
      return res.json(new ResponseSuccess({ tag }));
    } catch (error) {
      return res.json(new AppError('Failed when trying to create a tag.', (error as Error).message));
    }
  }

  public async list(req: Request, res: Response): Promise<Response> {
    try {
      const user_id = req.user.id;

      const tagRepository = getMongoRepository(Tag);
      const tags = await tagRepository.find({
        where: { user_id },
      });

      return res.json(new ResponseSuccess({ tags }));
    } catch (error) {
      return res.json(new AppError('Failed when trying to list tags.', (error as Error).message));
    }
  }

  public async update(req: Request, res: Response): Promise<Response> {
    try {
      const user_id = req.user.id;

      const schema = Yup.object().shape({
        name: Yup.string(),
        code: Yup.string(),
        tag_id: Yup.string().required(),
      });

      if (!(await schema.isValid(req.body))) {
        throw new Error('Error on validate mandatory informations');
      }

      const updateTagService = new UpdateTagService();

      await updateTagService.execute({
        ...req.body,
        user_id,
      });

      return res.json(new ResponseSuccess({ message: 'Tag updated successfully' }));
    } catch (error) {
      return res.json(new AppError('Failed when trying to update a Tag.', (error as Error).message));
    }
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { tag_id } = req.body;

      const schema = Yup.object().shape({
        tag_id: Yup.string().required(),
      });

      if (!(await schema.isValid(req.body))) {
        throw new Error('Error on validate mandatory informations');
      }

      const tagsRepository = getMongoRepository(Tag);

      const tag = await tagsRepository.findOne(tag_id);

      if (!tag) {
        throw new Error('Do not possibly delete');
      }

      await tagsRepository.remove(tag);

      return res.json(new ResponseSuccess({ message: 'Tag deleted successfully' }));
    } catch (error) {
      return res.json(new AppError('Failed when trying to delete a tag.', (error as Error).message));
    }
  }
}
