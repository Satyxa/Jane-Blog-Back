import { EmailManager } from '../helpers/email.manager';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AdminCheck } from '../../utils/admin-check';
import { UserRepository } from '../db/users.repository';

export class SendRecoveryCodeCommand {
  constructor(public email: string) {}
}

@CommandHandler(SendRecoveryCodeCommand)
export class SendRecoveryCodeHandler
  implements ICommandHandler<SendRecoveryCodeCommand>
{
  constructor(
    private emailManager: EmailManager,
    private adminCheck: AdminCheck,
    private userRepository: UserRepository,
  ) {}
  async execute(payload: SendRecoveryCodeCommand) {
    const { email } = payload;
    const user = await this.adminCheck.findByEmail(email);
    const recoveryCode = Math.floor(100000 + Math.random() * 900000).toString();
    await this.userRepository.updateRecoveryCode(user.id, recoveryCode);
    await this.emailManager.sendRecoveryCodeEmail(email, recoveryCode);
  }
}
