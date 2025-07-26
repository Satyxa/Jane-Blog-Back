import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AdminPagesRepository } from '../db/admin-pages.repository';
import { UpdateQuoteRequest } from '../swagger.validation/update-quote.request.model';

export class UpdateQuoteCommand {
  constructor(public payload: UpdateQuoteRequest) {}
}

@CommandHandler(UpdateQuoteCommand)
export class UpdateQuoteHandler implements ICommandHandler<UpdateQuoteCommand> {
  constructor(private adminPagesRepository: AdminPagesRepository) {}

  async execute({ payload }: UpdateQuoteCommand) {
    console.log(2);
    return await this.adminPagesRepository.updateQuote(payload);
  }
}
