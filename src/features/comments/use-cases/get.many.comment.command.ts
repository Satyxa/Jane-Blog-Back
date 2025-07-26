import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentRepository } from '../db/comments.repository';
import { QueryPaginationParams } from '../../posts/swagger.validation/query.params';
import { Comment } from '../db/comments.model';
import { checkIsPostExist } from '../../utils/is-post-exist';

export class GetCommentsCommand {
  constructor(
    public postId: string,
    public params: QueryPaginationParams,
  ) {}
}

@CommandHandler(GetCommentsCommand)
export class GetCommentsHandler implements ICommandHandler<GetCommentsCommand> {
  constructor(
    private commentRepository: CommentRepository,
    private isPostExist: checkIsPostExist,
  ) {}

  async execute({ postId, params }: GetCommentsCommand) {
    await this.isPostExist.check(postId);
    const { comments, totalCount } = await this.commentRepository.getComments(
      postId,
      +params.pageNumber,
      +params.pageSize,
    );

    return {
      totalCount,
      comments: comments.map((comment) => {
        return Comment.createViewModel(comment);
      }),
    };
  }
}
