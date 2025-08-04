import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateWFFPNAARequest } from '../swagger.validation/update-wff-pnaa.request.model';
import { FilesManager } from '../../files.manager';
import { AdminPagesRepository } from '../db/admin-pages.repository';
import { NotFoundError } from 'rxjs';

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
    const page = await this.adminPagesRepository.getWffPnaaPage(pageType);
    if (!page) throw new NotFoundError(`Page ${pageType} not found`);
    let urls: string[] = [];
    if (images) {
      urls = await this.filesManager.uploadImages(images, pageType, null);
    }

    const updatedPayload = {
      title: title.length > 0 ? title : page.title,
      text: text.length > 0 ? text : page.text,
      pageType,
      imagesUrls: urls.length ? urls : page?.imagesUrls,
    };
    return await this.adminPagesRepository.updateWffOrPnaa(updatedPayload);
  }
}
