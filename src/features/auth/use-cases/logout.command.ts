import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TokenExpiredRepository } from '../db/token.repository';
import { LogoutRequest } from '../swagger.validation/models/logout-model';

export class LogoutCommand {
  constructor(public payload: LogoutRequest) {}
}

@CommandHandler(LogoutCommand)
export class LogoutHandler implements ICommandHandler<LogoutCommand> {
  constructor(private tokenExpiredRepository: TokenExpiredRepository) {}

  async execute({ payload }: LogoutCommand) {
    await this.tokenExpiredRepository.expireToken(payload.token);
  }
}
