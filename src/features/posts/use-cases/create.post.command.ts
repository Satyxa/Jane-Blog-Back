import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePostRequest } from '../swagger.validation/create-post-request-model';
import { PostsRepository } from '../db/posts.repository';
import { Posts } from '../db/posts.model';
import { AdminCheck } from '../../utils/admin-check';
import { FilesManager } from '../../files.manager';
import { getRelativeTime } from '../../utils/createdAt-formatting';
import { BadRequestException } from '@nestjs/common';
import * as uuid from 'uuid';
export class CreatePostCommand {
  constructor(
    public payload: CreatePostRequest,
    public userId: string,
  ) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostHandler implements ICommandHandler<CreatePostCommand> {
  constructor(
    private postRepository: PostsRepository,
    private filesManager: FilesManager,
    private adminCheck: AdminCheck,
  ) {}

  async execute({ payload, userId }: CreatePostCommand) {
    const { text, title, file, images } = payload;

    const postId = uuid.v4();

    await this.adminCheck.findById(userId);
    let imageUrl: string | null = null;
    let imagesUrls: string[] | null = [];
    if (file && file.length > 0) {
      imageUrl = await this.filesManager.uploadImage(
        file[0].buffer,
        file[0].originalname,
        'posts/poster',
        postId,
      );
    } else if (file.length === 0) {
      throw new BadRequestException({
        field: 'file',
        message: 'File is required',
      });
    }

    if (images && images.length > 0) {
      imagesUrls = await this.filesManager.uploadImages(
        images,
        'posts/images',
        postId,
      );
    }

    const post = await this.postRepository.createPost({
      id: postId,
      user: { id: userId },
      text,
      title,
      imageUrl,
      imagesUrls,
    });

    return {
      id: post.id,
      title: post.title,
      userId: post.user.id,
      text: post.text,
      imageUrl: post.imageUrl,
      imagesUrls,
      createdAt: getRelativeTime(post.createdAt),
      comments: [],
    };
  }
}
