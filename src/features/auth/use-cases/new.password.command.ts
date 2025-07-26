import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AdminCheck } from '../../utils/admin-check';
import { UserRepository } from '../db/users.repository';
import * as bcrypt from 'bcryptjs';
import { BadRequestException } from '@nestjs/common';

export class NewPasswordCommand {
  constructor(
    public email: string,
    public recoveryCode: string,
    public newPassword: string,
  ) {}
}

@CommandHandler(NewPasswordCommand)
export class NewPasswordHandler implements ICommandHandler<NewPasswordCommand> {
  constructor(
    private adminCheck: AdminCheck,
    private userRepository: UserRepository,
  ) {}
  async execute(payload: NewPasswordCommand) {
    const { email, newPassword, recoveryCode } = payload;
    const user = await this.adminCheck.findByEmail(email);

    if (user.recoveryCode === recoveryCode) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(newPassword, salt);
      await this.userRepository.updatePassword(user.id, passwordHash);
      await this.userRepository.updateRecoveryCode(user.id, null);
    } else
      throw new BadRequestException([
        { field: 'recoveryCode', message: 'Invalid recovery code' },
      ]);
  }
}
