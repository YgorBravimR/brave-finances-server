import { Request, Response } from 'express';

import * as Yup from 'yup';
import AppError from '../../errors/AppError';

import ResponseSuccess from '../../libs/responseSuccess';
import { getMongoRepository } from 'typeorm';
import { CreditCard } from '../models/schemas/CreditCard';
import { CreateCreditCardService } from '../../services/CreditCards/CreateCreditCardService';
import { UpdateCreditCardService } from '../../services/CreditCards/UpdateCreditCardService';

export default class CreditCardsController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { flag, account_id, close_date, due_date, description, limit } = req.body;
      const user_id = req.user.id;

      const schema = Yup.object().shape({
        flag: Yup.string().required(),
        account_id: Yup.string().required(),
        close_date: Yup.number().required(),
        due_date: Yup.number().required(),
        limit: Yup.number().required(),
        description: Yup.string().required(),
      });

      if (!(await schema.isValid({ flag, account_id, close_date, due_date, description, limit }))) {
        throw new Error('Error on validate mandatory information');
      }

      const createCreditCard = new CreateCreditCardService();

      const creditCard = await createCreditCard.execute({
        flag,
        account_id,
        close_date,
        due_date,
        description,
        user_id,
        limit,
      });
      return res.json(new ResponseSuccess({ creditCard }));
    } catch (error) {
      return res.json(new AppError('Failed when trying to create a creditCard.', (error as Error).message));
    }
  }

  public async list(req: Request, res: Response): Promise<Response> {
    try {
      const user_id = req.user.id;

      const creditCardRepository = getMongoRepository(CreditCard);
      const creditCards = await creditCardRepository.find({
        where: { user_id },
      });

      return res.json(new ResponseSuccess({ creditCards }));
    } catch (error) {
      return res.json(new AppError('Failed when trying to list CreditCards.', (error as Error).message));
    }
  }

  public async update(req: Request, res: Response): Promise<Response> {
    try {
      const user_id = req.user.id;

      const schema = Yup.object().shape({
        flag: Yup.string(),
        account_id: Yup.string(),
        close_date: Yup.number(),
        due_date: Yup.number(),
        limit: Yup.number(),
        description: Yup.string(),
        credit_card_id: Yup.string().required(),
      });

      if (!(await schema.isValid(req.body))) {
        throw new Error('Error on validate mandatory informations');
      }

      const updateCreditCardService = new UpdateCreditCardService();

      await updateCreditCardService.execute({
        ...req.body,
        user_id,
      });

      return res.json(new ResponseSuccess({ message: 'CreditCard updated successfully' }));
    } catch (error) {
      return res.json(new AppError('Failed when trying to update a CreditCard.', (error as Error).message));
    }
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { credit_card_id } = req.body;

      const schema = Yup.object().shape({
        credit_card_id: Yup.string().required(),
      });

      if (!(await schema.isValid(req.body))) {
        throw new Error('Error on validate mandatory informations');
      }

      const updateCreditCardService = new UpdateCreditCardService();

      await updateCreditCardService.execute({
        enable: false,
        credit_card_id,
      });

      return res.json(new ResponseSuccess({ message: 'CreditCard deleted successfully' }));
    } catch (error) {
      return res.json(new AppError('Failed when trying to delete a CreditCard.', (error as Error).message));
    }
  }
}
