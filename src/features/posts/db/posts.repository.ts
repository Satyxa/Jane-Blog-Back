import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Posts } from './posts.model';
import { QueryPaginationParams } from '../swagger.validation/query.params';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectRepository(Posts)
    protected PostRepository: Repository<Posts>,
  ) {}

  async getPosts(
    params: QueryPaginationParams,
  ): Promise<{ posts: Posts[]; totalCount: number }> {
    const posts = await this.PostRepository.find({
      order: {
        createdAt: 'DESC',
      },
      skip: +params.pageSize * (+params.pageNumber - 1),
      take: +params.pageSize,
    });
    const totalCount = await this.PostRepository.count({});

    return { posts, totalCount };
  }

  async getPost(id: string) {
    return await this.PostRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async createPost(payload: {
    text: string;
    title: string;
    imageUrl: string | null;
    user: { id: string };
    imagesUrls: string[];
  }): Promise<Posts> {
    return await this.PostRepository.save(payload);
  }

  async deletePostById(postId: string) {
    await this.PostRepository.delete({ id: postId });
  }

  async updatePost(
    postId: string,
    payload: {
      text: string;
      title: string;
      imageUrl: string | null;
      imagesUrls: string[];
    },
  ) {
    await this.PostRepository.update({ id: postId }, { ...payload });
  }
}
