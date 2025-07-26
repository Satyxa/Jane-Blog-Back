import { BadRequestException, Injectable } from '@nestjs/common';
import { PostsRepository } from '../posts/db/posts.repository';
@Injectable()
export class checkIsPostExist {
  constructor(private postRepository: PostsRepository) {}

  public async check(id: string) {
    const post = await this.postRepository.getPost(id);
    if (!post)
      throw new BadRequestException([
        {
          message: `Post with id ${id} now found`,
          field: 'id',
        },
      ]);
    else return post;
  }
}
