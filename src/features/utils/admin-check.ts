import { UserRepository } from '../auth/db/users.repository';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '../auth/db/users.model';
@Injectable()
export class AdminCheck {
  constructor(
    private userRepository: UserRepository,
    private configService: ConfigService,
  ) {}

  public async findById(id: string) {
    const user = await this.userRepository.getUserById(id);
    if (!user)
      throw new BadRequestException([
        {
          message: 'User does not exist',
          field: 'id',
        },
      ]);
    return this.checkAdmin(user);
  }
  public async findByEmail(email: string) {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user)
      throw new BadRequestException([
        {
          message: 'User does not exist',
          field: 'email',
        },
      ]);
    return this.checkAdmin(user);
  }

  public checkAdmin(user: User) {
    if (user.email === this.configService.get('ADMIN_EMAIL')) return user;
    else throw new ForbiddenException('Only admin can do it');
  }
}
