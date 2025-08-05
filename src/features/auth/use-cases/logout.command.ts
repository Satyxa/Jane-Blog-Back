import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TokenExpiredRepository } from '../db/token.repository';
import { LogoutRequest } from '../swagger.validation/models/logout-model';
import { UnauthorizedException } from '@nestjs/common';

export class LogoutCommand {
  constructor(public payload: LogoutRequest) {}
}

@CommandHandler(LogoutCommand)
export class LogoutHandler implements ICommandHandler<LogoutCommand> {
  constructor(private tokenExpiredRepository: TokenExpiredRepository) {}

  async execute({ payload }: LogoutCommand) {
    const isTokenAlreadyExpired = await this.tokenExpiredRepository.getToken(
      payload.token,
    );
    console.log(isTokenAlreadyExpired, 'isTokenAlreadyExpired');
    if (isTokenAlreadyExpired) throw new UnauthorizedException('Unauthorized');
    await this.tokenExpiredRepository.expireToken(payload.token);
  }
}
