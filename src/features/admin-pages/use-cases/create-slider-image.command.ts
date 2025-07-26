import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FilesManager } from '../../files.manager';
import { AdminPagesRepository } from '../db/admin-pages.repository';

export class SaveSliderImageCommand {
  constructor(public payload: { file: Express.Multer.File }) {}
}

@CommandHandler(SaveSliderImageCommand)
export class SaveSliderImageHandler
  implements ICommandHandler<SaveSliderImageCommand>
{
  constructor(
    private filesManager: FilesManager,
    private adminPagesRepository: AdminPagesRepository,
  ) {}

  async execute({ payload }: SaveSliderImageCommand) {
    const { file } = payload;
    console.log(file);
    const url = await this.filesManager.uploadImage(
      file.buffer,
      file.originalname,
      'slider',
    );

    return await this.adminPagesRepository.saveSliderImage({ url });
  }
}
