import { CommandBus } from '@nestjs/cqrs';
import { ApiBadRequestResponse, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { BadRequestResponseOptions } from '../utils/swagger.constants';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../auth/helpers/auth.guard';
import { extname } from 'path';
import { UpdateWFFPNAARequest } from './swagger.validation/update-wff-pnaa.request.model';
import * as multer from 'multer';
import { UpdateQuoteCommand } from './use-cases/update-quote.command';
import { UpdateQuoteRequest } from './swagger.validation/update-quote.request.model';
import { UpdateWffPnaaCommand } from './use-cases/update-wff-pnaa.command';
import { AdminPagesRepository } from './db/admin-pages.repository';
import { PageType } from './db/wff-pnaa-pages.model';
import { SaveSliderImageCommand } from './use-cases/create-slider-image.command';
@Controller('admin-pages')
export class AdminPagesController {
  constructor(
    private commandBus: CommandBus,
    private adminPagesRepository: AdminPagesRepository,
  ) {}

  @ApiBadRequestResponse(BadRequestResponseOptions)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Form data with images',
    type: UpdateWFFPNAARequest,
  })
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 50 * 1024 * 1024,
        files: 10,
      },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/^image\/(jpeg|png|webp|gif|jpg)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  @Put('/wff-pnaa-pages')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePage(
    @Body() payload: UpdateWFFPNAARequest,
    @UploadedFiles()
    images: Express.Multer.File[],
  ) {
    return await this.commandBus.execute(
      new UpdateWffPnaaCommand({ ...payload, images: images ?? [] }),
    );
  }

  @UseGuards(AuthGuard)
  @Put('/quote')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateQuote(@Body() payload: UpdateQuoteRequest) {
    return await this.commandBus.execute(new UpdateQuoteCommand(payload));
  }

  @Get('/wff-pnaa-pages')
  @HttpCode(HttpStatus.OK)
  async getWffPnaaPage(@Query() payload: { pageType: PageType }) {
    return await this.adminPagesRepository.getWffPnaaPage(payload.pageType);
  }

  @Get('/quote')
  @HttpCode(HttpStatus.OK)
  async getQuote() {
    const quoteArr = await this.adminPagesRepository.getQuote();
    return quoteArr[0];
  }

  @UseGuards(AuthGuard)
  @Post('/slider')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.OK)
  async addSliderImage(@UploadedFile() file: Express.Multer.File) {
    await this.commandBus.execute(new SaveSliderImageCommand({ file }));
  }

  @UseGuards(AuthGuard)
  @Delete('/slider')
  async deleteSlide(@Body('url') url: string) {
    await this.adminPagesRepository.deleteSliderImage({ url });
  }

  @Get('/slider')
  async getSliderImages() {
    return await this.adminPagesRepository.getSliderImages();
  }
}
