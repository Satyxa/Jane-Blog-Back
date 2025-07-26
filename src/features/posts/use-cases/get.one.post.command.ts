import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Posts } from '../db/posts.model';
import { Comment, CommentViewModel } from '../../comments/db/comments.model';
import { CommentRepository } from '../../comments/db/comments.repository';
import { QueryPaginationParams } from '../swagger.validation/query.params';
import { checkIsPostExist } from '../../utils/is-post-exist';
import { getRelativeTime } from '../../utils/createdAt-formatting';

export class GetOnePostCommand {
  constructor(
    public id: string,
    public params: QueryPaginationParams,
  ) {}
}

@CommandHandler(GetOnePostCommand)
export class GetOnePostHandler implements ICommandHandler<GetOnePostCommand> {
  constructor(
    private isPostExist: checkIsPostExist,
    private commentRepository: CommentRepository,
  ) {}

  async execute(payload: { id: string; params: QueryPaginationParams }) {
    const { id, params } = payload;
    const post = await this.isPostExist.check(payload.id);

    const { comments, totalCount } = await this.commentRepository.getComments(
      id,
      +params.pageNumber,
      +params.pageSize,
    );

    return {
      commentsTotalCount: totalCount,
      post: {
        id: post.id,
        title: post.title,
        userId: post.user.id,
        text: post.text,
        imageUrl: post.imageUrl,
        imagesUrls: post.imagesUrls,
        createdAt: getRelativeTime(post.createdAt),
        comments: comments.map((comment: Comment) => {
          const replies = comment.replies
            .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()) // ← вот тут сортируем
            .map((reply: Comment) => Comment.createViewModel(reply));

          const viewComment = Comment.createViewModel(comment);
          return {
            ...viewComment,
            replies,
          };
        }),
      },
    };
  }
}
