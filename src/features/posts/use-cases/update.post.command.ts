import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../db/posts.repository';
import { AdminCheck } from '../../utils/admin-check';
import { checkIsPostExist } from '../../utils/is-post-exist';
import { CreatePostRequest } from '../swagger.validation/create-post-request-model';
import { FilesManager } from '../../files.manager';

export class UpdateOnePostCommand {
  constructor(
    public id: string,
    public userId: string,
    public data: CreatePostRequest,
  ) {}
}

@CommandHandler(UpdateOnePostCommand)
export class UpdateOnePostHandler
  implements ICommandHandler<UpdateOnePostCommand>
{
  constructor(
    private postRepository: PostsRepository,
    private adminCheck: AdminCheck,
    private isPostExist: checkIsPostExist,
    private filesManager: FilesManager,
  ) {}

  async execute(payload: {
    id: string;
    userId: string;
    data: {
      text: string;
      title: string;
      file: Express.Multer.File[];
      images: Express.Multer.File[];
    };
  }) {
    const { text, title, file, images } = payload.data;
    await this.adminCheck.findById(payload.userId);
    const post = await this.isPostExist.check(payload.id);
    let imageUrl: string | null = post.imageUrl;
    let imagesUrls: string[] | null = post.imagesUrls;

    if (file && file.length > 0) {
      if (post.imageUrl) await this.filesManager.deleteImage(post.imageUrl);
      imageUrl = await this.filesManager.uploadImage(
        file[0].buffer,
        file[0].originalname,
        post.id,
      );
    }

    if (images && images.length > 0) {
      if (post.imagesUrls.length > 0)
        await this.filesManager.deleteImages(post.imagesUrls);
      imagesUrls = await this.filesManager.uploadImages(
        images,
        'posts/images',
        post.id,
      );
    }

    return await this.postRepository.updatePost(payload.id, {
      text: text ? text : post.text,
      title: title ? title : post.title,
      imageUrl,
      imagesUrls,
    });
  }
}
