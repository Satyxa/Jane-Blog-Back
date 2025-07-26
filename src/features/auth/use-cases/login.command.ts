import { UserRepository } from '../db/users.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginRegistrationRequest } from '../swagger.validation/models/login-registration-request-model';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '../helpers/jwt-service';
import { BadRequestException } from '@nestjs/common';

export class LoginCommand {
  constructor(public payload: LoginRegistrationRequest) {}
}

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async execute({ payload }: LoginCommand) {
    const { email, password } = payload;
    const user = await this.userRepository.getUserByEmail(email);
    if (user) {
      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (isValidPassword)
        return { accessToken: this.jwtService.createToken(user.id) };
      else if (!isValidPassword)
        throw new BadRequestException([
          {
            message: 'Invalid password',
            field: 'password',
          },
        ]);
    } else if (!user) {
      throw new BadRequestException([
        {
          message: 'User with that email does not exist',
          field: 'email',
        },
      ]);
    }
  }
}
