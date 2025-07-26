import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FilesManager } from '../../files.manager';
import { AdminPagesRepository } from '../db/admin-pages.repository';

export class DeleteSliderImageCommand {
  constructor(public payload: { url: string }) {}
}

@CommandHandler(DeleteSliderImageCommand)
export class DeleteSliderImageHandler
  implements ICommandHandler<DeleteSliderImageCommand>
{
  constructor(
    private filesManager: FilesManager,
    private adminPagesRepository: AdminPagesRepository,
  ) {}

  async execute({ payload }: DeleteSliderImageCommand) {
    const { url } = payload;

    await this.filesManager.deleteImage(url);

    return await this.adminPagesRepository.deleteSliderImage({ url });
  }
}
