import { Injectable } from '@nestjs/common';
import { DeepPartial, IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './comments.model';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectRepository(Comment)
    protected CommentRepository: Repository<Comment>,
  ) {}

  async getComments(
    postId: string,
    pageNumber: number,
    pageSize: number,
  ): Promise<{ comments: Comment[]; totalCount: number }> {
    const comments = await this.CommentRepository.find({
      where: { post: { id: postId }, parentComment: IsNull() },
      relations: ['post', 'replies'],
      order: {
        createdAt: 'ASC',
      },
      skip: pageSize * (pageNumber - 1),
      take: pageSize,
    });

    const totalCount = await this.CommentRepository.count({
      where: { post: { id: postId }, parentComment: IsNull() },
    });

    return { comments, totalCount };
  }

  async getComment(id: string): Promise<Comment | null> {
    return await this.CommentRepository.findOne({
      where: { id },
      relations: ['post'],
    });
  }

  async createComment(payload: {
    postId: string;
    username: string;
    text: string;
    replyToId: string | null;
  }): Promise<Comment> {
    const commentData: DeepPartial<Comment> = {
      username: payload.username,
      text: payload.text,
      post: { id: payload.postId },
      ...(payload.replyToId && {
        parentComment: { id: payload.replyToId },
      }),
    };
    console.log(commentData);
    return await this.CommentRepository.save(commentData);
  }

  async deleteCommentById(id: string) {
    await this.CommentRepository.delete({ id });
  }
}
