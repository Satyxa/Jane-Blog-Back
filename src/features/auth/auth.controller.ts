import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Req,
  Res,
  Get,
} from '@nestjs/common';
import { LoginRegistrationRequest } from './swagger.validation/models/login-registration-request-model';
import { CommandBus } from '@nestjs/cqrs';
import { ConfigService } from '@nestjs/config';
import { RegistrationCommand } from './use-cases/registration.command';
import { LoginCommand } from './use-cases/login.command';
import { User } from './db/users.model';
import { SwaggerLoginResponseDecorator } from './swagger.validation/decorators/login-response-decorator';
import { SwaggerRegistrationResponseDecorator } from './swagger.validation/decorators/registration-response-decorator';
import { ApiBadRequestResponse } from '@nestjs/swagger';
import { BadRequestResponseOptions } from '../utils/swagger.constants';
import { SendRecoveryCodeRequest } from './swagger.validation/models/send-recovery-code-model';
import { NewPasswordRequest } from './swagger.validation/models/new-password-model';
import { SendRecoveryCodeCommand } from './use-cases/send.recovery.code.command';
import { NewPasswordCommand } from './use-cases/new.password.command';
import { LogoutCommand } from './use-cases/logout.command';
import { LogoutRequest } from './swagger.validation/models/logout-model';
import { GetMeCommand } from './use-cases/get-me.command';
import { Request, Response } from 'express';
import { cookieOptions } from './cookieOptions';
@Controller('auth')
export class AuthController {
  constructor(
    private commandBus: CommandBus,
    private configService: ConfigService,
  ) {}
  @Get('me')
  getMe(@Req() req: Request) {
    const token = req.cookies['accessToken'];
    return this.commandBus.execute(new GetMeCommand(token));
  }

  @ApiBadRequestResponse(BadRequestResponseOptions)
  @SwaggerRegistrationResponseDecorator()
  @Post('registration')
  @HttpCode(HttpStatus.OK)
  async register(@Body() payload: LoginRegistrationRequest): Promise<User> {
    return await this.commandBus.execute(new RegistrationCommand(payload));
  }
  @ApiBadRequestResponse(BadRequestResponseOptions)
  @SwaggerLoginResponseDecorator()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() payload: LoginRegistrationRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<string> {
    console.log(1);
    const token = await this.commandBus.execute(new LoginCommand(payload));
    res.cookie('accessToken', token, cookieOptions('localhost'));
    return token;
  }

  @Post('recovery-code')
  @HttpCode(HttpStatus.NO_CONTENT)
  async recoveryCode(@Body() payload: SendRecoveryCodeRequest) {
    await this.commandBus.execute(new SendRecoveryCodeCommand(payload.email));
  }

  @Post('new-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async passwordRecovery(@Body() payload: NewPasswordRequest) {
    await this.commandBus.execute(
      new NewPasswordCommand(
        payload.email,
        payload.recoveryCode,
        payload.newPassword,
      ),
    );
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const accessToken = req.cookies['accessToken'];

    if (accessToken) {
      await this.commandBus.execute(new LogoutCommand({ token: accessToken }));
    }

    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });
  }
}
