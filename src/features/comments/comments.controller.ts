import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Delete,
  Param,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '../auth/helpers/auth.guard';
import { Request } from 'express';
import { CreateCommentCommand } from './use-cases/create.comment.command';
import { CreateCommentRequest } from './swagger.validation/create-comment-request-model';
import { GetCommentsCommand } from './use-cases/get.many.comment.command';
import { DeleteOneCommentCommand } from './use-cases/delete.comment.command';
import { QueryPaginationParams } from '../posts/swagger.validation/query.params';
import { ApiBadRequestResponse, ApiTags } from '@nestjs/swagger';
import { BadRequestResponseOptions } from '../utils/swagger.constants';
import { SwaggerCreateCommentResponseDecorator } from './swagger.validation/comment-create-response-decorator';
import { SwaggerGetCommentsForPostResponseDecorator } from './swagger.validation/comment-read-for-current-post-response-decorator';
@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(private commandBus: CommandBus) {}
  @ApiBadRequestResponse(BadRequestResponseOptions)
  @SwaggerCreateCommentResponseDecorator()
  @Post(':postId')
  @HttpCode(HttpStatus.OK)
  async createComment(
    @Body() payload: CreateCommentRequest,
    @Param('postId') postId: string,
  ): Promise<Comment | null> {
    return await this.commandBus.execute(
      new CreateCommentCommand(payload, postId),
    );
  }
  @ApiBadRequestResponse(BadRequestResponseOptions)
  @SwaggerGetCommentsForPostResponseDecorator()
  @Get(':postId')
  @HttpCode(HttpStatus.OK)
  async getComments(
    @Param('postId') postId: string,
    @Query() params: QueryPaginationParams,
  ): Promise<Comment[]> {
    console.log('controller');
    return await this.commandBus.execute(
      new GetCommentsCommand(postId, params),
    );
  }
  @ApiBadRequestResponse(BadRequestResponseOptions)
  @UseGuards(AuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteComment(
    @Req() req: Request,
    @Param('id') id: string,
  ): Promise<string> {
    return await this.commandBus.execute(
      new DeleteOneCommentCommand(id, req.userId!),
    );
  }
}
