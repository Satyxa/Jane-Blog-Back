import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../db/posts.repository';
import { getRelativeTime } from '../../utils/createdAt-formatting';
import { QueryPaginationParams } from '../swagger.validation/query.params';

export class GetAllPostsCommand {
  constructor(public params: QueryPaginationParams) {}
}

@CommandHandler(GetAllPostsCommand)
export class GetAllPostsHandler implements ICommandHandler<GetAllPostsCommand> {
  constructor(private postRepository: PostsRepository) {}

  async execute({ params }: GetAllPostsCommand) {
    const { posts, totalCount } = await this.postRepository.getPosts(params);

    return {
      totalCount,
      posts: posts.map((post) => {
        return {
          id: post.id,
          title: post.title,
          imageUrl: post.imageUrl,
          createdAt: getRelativeTime(post.createdAt),
        };
      }),
    };
  }
}
