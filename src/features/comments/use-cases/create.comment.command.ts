import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCommentRequest } from '../swagger.validation/create-comment-request-model';
import { CommentRepository } from '../db/comments.repository';
import { Comment } from '../db/comments.model';
import { checkIsPostExist } from '../../utils/is-post-exist';

export class CreateCommentCommand {
  constructor(
    public payload: CreateCommentRequest,
    public postId: string,
  ) {}
}

@CommandHandler(CreateCommentCommand)
export class CreateCommentHandler
  implements ICommandHandler<CreateCommentCommand>
{
  constructor(
    private commentRepository: CommentRepository,
    private isPostExist: checkIsPostExist,
  ) {}

  async execute({ payload, postId }: CreateCommentCommand) {
    const { text, username, replyToId } = payload;
    await this.isPostExist.check(postId);

    const comment = await this.commentRepository.createComment({
      postId,
      text,
      username,
      replyToId: replyToId ?? null,
    });

    return Comment.createViewModel(comment);
  }
}
