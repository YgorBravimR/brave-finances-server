import { getMongoRepository } from 'typeorm';
import { Tag } from '../../app/models/schemas/Tag';

interface IRequest {
  name?: string;
  code?: string;
  tag_id: string;
}

class UpdateTagService {
  public async execute(tagChanges: IRequest): Promise<void> {
    const tagRepository = getMongoRepository(Tag);

    const { tag_id } = tagChanges;

    const tag = await tagRepository.findOne(tag_id);
    if (!tag) {
      throw new Error('Tag not found');
    }

    await tagRepository.update(
      {
        id: tag.id,
      },
      tagChanges,
    );

    return;
  }
}

export { UpdateTagService };
