import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../db/users.repository';
import { JwtService } from '../helpers/jwt-service';
import { UnauthorizedException } from '@nestjs/common';

export class GetMeCommand {
  constructor(public payload: { accessToken: string }) {}
}

@CommandHandler(GetMeCommand)
export class GetMeHandler implements ICommandHandler<GetMeCommand> {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async execute({ payload }: GetMeCommand) {
    console.log(payload.accessToken);
    const tokenPayload = this.jwtService.getResultByToken(payload.accessToken);
    if (!tokenPayload) throw new UnauthorizedException('Unauthorized');
    const user = await this.userRepository.getUserById(tokenPayload.id);
    if (!user) throw new UnauthorizedException('Unauthorized');
    return user;
  }
}
