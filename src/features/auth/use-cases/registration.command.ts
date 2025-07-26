import { UserRepository } from '../db/users.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginRegistrationRequest } from '../swagger.validation/models/login-registration-request-model';
import * as bcrypt from 'bcryptjs';
import { User } from '../db/users.model';
import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export class RegistrationCommand {
  constructor(public payload: LoginRegistrationRequest) {}
}

@CommandHandler(RegistrationCommand)
export class RegistrationHandler
  implements ICommandHandler<RegistrationCommand>
{
  constructor(
    private userRepository: UserRepository,
    private configService: ConfigService,
  ) {}

  async execute({ payload }: RegistrationCommand) {
    const { email, password } = payload;

    if (email !== this.configService.get('ADMIN_EMAIL'))
      throw new BadRequestException([
        {
          message: 'Only admin can create an account',
          field: 'email',
        },
      ]);
    const user = await this.userRepository.getUserByEmail(email);
    if (user)
      throw new BadRequestException([
        {
          message: 'User with that email already exist',
          field: 'email',
        },
      ]);
    else if (!user) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const user = await this.userRepository.createUser({
        email,
        passwordHash,
      });

      return User.createViewModel(user);
    }
  }
}
