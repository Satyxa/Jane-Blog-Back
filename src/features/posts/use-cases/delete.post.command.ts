import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../db/posts.repository';
import { AdminCheck } from '../../utils/admin-check';
import { checkIsPostExist } from '../../utils/is-post-exist';

export class DeleteOnePostCommand {
  constructor(
    public id: string,
    public userId: string,
  ) {}
}

@CommandHandler(DeleteOnePostCommand)
export class DeleteOnePostHandler
  implements ICommandHandler<DeleteOnePostCommand>
{
  constructor(
    private postRepository: PostsRepository,
    private adminCheck: AdminCheck,
    private isPostExist: checkIsPostExist,
  ) {}

  async execute(payload: { id: string; userId: string }) {
    await this.adminCheck.findById(payload.userId);
    await this.isPostExist.check(payload.id);
    return await this.postRepository.deletePostById(payload.id);
  }
}
