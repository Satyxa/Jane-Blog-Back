import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Put,
  Delete,
  Param,
  UseGuards,
  Req,
  Query,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  UploadedFiles,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ConfigService } from '@nestjs/config';
import { CreatePostRequest } from './swagger.validation/create-post-request-model';
import { Posts } from './db/posts.model';
import { CreatePostCommand } from './use-cases/create.post.command';
import { GetOnePostCommand } from './use-cases/get.one.post.command';
import { GetAllPostsCommand } from './use-cases/get.all.posts.command';
import { AuthGuard } from '../auth/helpers/auth.guard';
import { Request } from 'express';
import { UpdateOnePostCommand } from './use-cases/update.post.command';
import { DeleteOnePostCommand } from './use-cases/delete.post.command';
import { QueryPaginationParams } from './swagger.validation/query.params';
import { SwaggerCreatePostResponseDecorator } from './swagger.validation/posts-create-response-decorator';
import { SwaggerReadOnePostResponseDecorator } from './swagger.validation/posts-read-one-response-decorator';
import { SwaggerReadManyPostResponseDecorator } from './swagger.validation/posts-read-many-response-decorator';
import { ApiBadRequestResponse } from '@nestjs/swagger';
import { BadRequestResponseOptions } from '../utils/swagger.constants';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';

@Controller('posts')
export class PostsController {
  constructor(private commandBus: CommandBus) {}
  @ApiBadRequestResponse(BadRequestResponseOptions)
  @SwaggerCreatePostResponseDecorator()
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'file', maxCount: 1 }, // постер
        { name: 'images', maxCount: 10 }, // доп. изображения
      ],
      {
        storage: multer.memoryStorage(), // <== важно, чтобы был file.buffer
        limits: {
          fileSize: 50 * 1024 * 1024, // 50MB
          files: 11,
        },
        fileFilter: (req, file, cb) => {
          if (!file.mimetype.match(/^image\/(jpeg|png|gif|webp|jpg)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
          }
          cb(null, true);
        },
      },
    ),
  )
  @Post()
  @HttpCode(HttpStatus.OK)
  async createPost(
    @Body() payload: CreatePostRequest,
    @Req() req: Request,
    @UploadedFiles()
    files: {
      file: Express.Multer.File[];
      images?: Express.Multer.File[];
    },
  ): Promise<Posts | null> {
    console.log('create POST (#)RI@#)(R)@#');
    if (!req.userId) return null;
    return await this.commandBus.execute(
      new CreatePostCommand({ ...payload, ...files }, req.userId),
    );
  }
  @ApiBadRequestResponse(BadRequestResponseOptions)
  @SwaggerReadOnePostResponseDecorator()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getPost(
    @Param('id') id: string,
    @Query() params: QueryPaginationParams,
  ): Promise<Posts> {
    return await this.commandBus.execute(new GetOnePostCommand(id, params));
  }
  @SwaggerReadManyPostResponseDecorator()
  @Get()
  @HttpCode(HttpStatus.OK)
  async getPosts(@Query() params: QueryPaginationParams): Promise<Posts[]> {
    return await this.commandBus.execute(new GetAllPostsCommand(params));
  }
  @ApiBadRequestResponse(BadRequestResponseOptions)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'file', maxCount: 1 }, // постер
        { name: 'images', maxCount: 10 }, // доп. изображения
      ],
      {
        storage: multer.memoryStorage(), // <== важно, чтобы был file.buffer
        limits: {
          fileSize: 50 * 1024 * 1024, // 50MB
          files: 11,
        },
        fileFilter: (req, file, cb) => {
          if (!file.mimetype.match(/^image\/(jpeg|png|gif|webp|jpg)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
          }
          cb(null, true);
        },
      },
    ),
  )
  @UseGuards(AuthGuard)
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePost(
    @Body() payload: CreatePostRequest,
    @Req() req: Request,
    @Param('id') id: string,
    @UploadedFiles()
    files: {
      file: Express.Multer.File[];
      images?: Express.Multer.File[];
    },
  ): Promise<string> {
    return await this.commandBus.execute(
      new UpdateOnePostCommand(id, req.userId!, { ...payload, ...files }),
    );
  }
  @ApiBadRequestResponse(BadRequestResponseOptions)
  @UseGuards(AuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(
    @Req() req: Request,
    @Param('id') id: string,
  ): Promise<string> {
    return await this.commandBus.execute(
      new DeleteOnePostCommand(id, req.userId!),
    );
  }
}
