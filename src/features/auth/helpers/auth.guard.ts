import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from './jwt-service';
import { UserRepository } from '../db/users.repository';
import { Request } from 'express';
import { TokenExpiredRepository } from '../db/token.repository';

// @Injectable()
// export class AuthGuard implements CanActivate {
//   constructor(
//     private userRepository: UserRepository,
//     private tokenExpiredRepository: TokenExpiredRepository,
//     private jwtService: JwtService,
//   ) {}
//
//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const req: Request = context.switchToHttp().getRequest();
//     if (!req.headers.authorization) throw new UnauthorizedException();
//
//     const token = req.headers.authorization.split(' ')[1];
//     if (req.headers.authorization.split(' ')[0] !== 'Bearer')
//       throw new UnauthorizedException();
//     if (!token) throw new UnauthorizedException();
//
//     const isTokenExpired = await this.tokenExpiredRepository.getToken(token);
//     if (isTokenExpired)
//       throw new BadRequestException([
//         {
//           field: 'token',
//           message: 'Token expires',
//         },
//       ]);
//
//     if (!this.jwtService.getResultByToken(token))
//       throw new UnauthorizedException();
//     const tokenPayload = this.jwtService.getResultByToken(token);
//     if (!tokenPayload) throw new UnauthorizedException();
//
//     const { id } = tokenPayload;
//     const user = await this.userRepository.getUserById(id);
//
//     if (user) {
//       req.userId = id;
//       return true;
//     } else return false;
//   }
// }

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private userRepository: UserRepository,
    private tokenExpiredRepository: TokenExpiredRepository,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();

    const token = req.cookies?.accessToken.accessToken;
    if (!token)
      throw new UnauthorizedException('Access token not found in cookies');

    const isTokenExpired = await this.tokenExpiredRepository.getToken(token);
    if (isTokenExpired) {
      throw new BadRequestException([
        {
          field: 'token',
          message: 'Token has expired',
        },
      ]);
    }

    const tokenPayload = this.jwtService.getResultByToken(token);
    if (!tokenPayload) throw new UnauthorizedException('Invalid token');

    const { id } = tokenPayload;
    const user = await this.userRepository.getUserById(id);
    if (!user) throw new UnauthorizedException('User not found');

    (req as any).userId = id;
    return true;
  }
}
