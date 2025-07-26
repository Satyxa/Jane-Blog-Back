import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateWFFPNAARequest } from '../swagger.validation/update-wff-pnaa.request.model';
import { FilesManager } from '../../files.manager';
import { AdminPagesRepository } from '../db/admin-pages.repository';

export class UpdateWffPnaaCommand {
  constructor(public payload: UpdateWFFPNAARequest) {}
}

@CommandHandler(UpdateWffPnaaCommand)
export class UpdateWFFPNAAHandler
  implements ICommandHandler<UpdateWffPnaaCommand>
{
  constructor(
    private filesManager: FilesManager,
    private adminPagesRepository: AdminPagesRepository,
  ) {}

  async execute({ payload }: UpdateWffPnaaCommand) {
    const { title, text, pageType, images } = payload;
    const urls = await this.filesManager.uploadImages(images, pageType);

    const page = { title, text, pageType, imagesUrls: urls };
    return await this.adminPagesRepository.updateWffOrPnaa(page);
  }
}
