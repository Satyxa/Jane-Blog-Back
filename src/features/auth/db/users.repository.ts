import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.model';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    protected UserRepository: Repository<User>,
  ) {}

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.UserRepository.findOneBy({ email });
  }

  async getUserById(id: string): Promise<User | null> {
    return await this.UserRepository.findOneBy({ id });
  }

  async createUser(payload: { email: string; passwordHash: string }) {
    return await this.UserRepository.save(payload);
  }

  async updateRecoveryCode(id: string, recoveryCode: string | null) {
    return await this.UserRepository.update({ id }, { recoveryCode });
  }

  async updatePassword(id: string, passwordHash: string) {
    return await this.UserRepository.update({ id }, { passwordHash });
  }

  async deleteUser(id: string) {
    return await this.UserRepository.delete({ id });
  }
}
