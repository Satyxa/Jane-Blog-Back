import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TokenExpired } from './token.expired.model';

@Injectable()
export class TokenExpiredRepository {
  constructor(
    @InjectRepository(TokenExpired)
    protected tokenExpiredRepository: Repository<TokenExpired>,
  ) {}
  async getToken(token: string): Promise<TokenExpired | null> {
    return await this.tokenExpiredRepository.findOneBy({ token });
  }

  async expireToken(token: string) {
    return await this.tokenExpiredRepository.save({ token });
  }
}
