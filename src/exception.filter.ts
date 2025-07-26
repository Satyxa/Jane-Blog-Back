import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';

export interface ErrorType {
  message: string;
  field: string;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const res: Response = ctx.getResponse();
    const req: Request = ctx.getRequest();
    const status: number = exception.getStatus();
    if (status === 400) {
      console.log(1);
      console.log(exception.getResponse());
      const errors: ErrorType[] = [];
      const exceptionBody: any = exception.getResponse();
      exceptionBody.message.forEach((m) => errors.push(m));
      return res.status(status).send({ errorsMessages: errors });
    } else if (status === 401) {
      return res.sendStatus(status);
    }

    return res.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: req.url,
    });
  }
}

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  public catch(
    exception: UnauthorizedException,
    host: ArgumentsHost,
  ): Response {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    return response.status(401).json({ statusCode: 401 });
  }
}
