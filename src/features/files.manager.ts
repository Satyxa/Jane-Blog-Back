import { Storage } from '@google-cloud/storage';
import * as uuid from 'uuid';
import * as mime from 'mime-types';
import { Readable } from 'stream';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PageType } from './admin-pages/db/wff-pnaa-pages.model';
import { getLogger } from 'nodemailer/lib/shared';

@Injectable()
export class FilesManager {
  private storage: Storage;
  private bucketName: string;
  private migrated = false;
  constructor(private configService: ConfigService) {
    this.bucketName = this.configService.get('GCS_BUCKET_NAME')!;
    this.storage = new Storage({
      keyFilename: this.configService.get('GCS_KEY_PATH'),
    });
  }

  async uploadImage(
    fileBuffer: Buffer,
    originalName: string,
    folder = 'posts/poster',
  ): Promise<string> {
    const parts = originalName.split('.');
    const extension = parts.length > 1 ? `.${parts.pop()}` : '.jpg';
    const fileName = `${folder}/${uuid.v4()}${extension}`;
    const bucket = this.storage.bucket(this.bucketName);
    const file = bucket.file(fileName);
    await file.save(fileBuffer, {
      contentType: mime.lookup(extension) || 'image/jpeg',
      resumable: false,
    });
    // await file.makePublic();
    return `https://storage.googleapis.com/${this.bucketName}/${fileName}`;
  }

  async uploadImages(
    files: Express.Multer.File[],
    folder: PageType | 'posts/images',
  ): Promise<string[]> {
    if (files.length > 10) {
      throw new BadRequestException({
        field: 'images',
        message: 'Cannot upload more than 10 images',
      });
    }

    const bucket = this.storage.bucket(this.bucketName);

    const [existingFiles] = await bucket.getFiles({ prefix: `${folder}/` });

    if (existingFiles.length > 0) {
      await Promise.all(existingFiles.map((file) => file.delete()));
    }

    const urls = await Promise.all(
      files.map((file) =>
        this.uploadImage(file.buffer, file.originalname, folder),
      ),
    );

    return urls;
  }

  async getImageStream(filePath: string): Promise<Readable> {
    const bucket = this.storage.bucket(this.bucketName);
    const file = bucket.file(filePath);
    const exists = (await file.exists())[0];
    if (!exists) throw new Error('File not found in GCS');
    return file.createReadStream();
  }

  async deleteImage(fileUrl: string): Promise<void> {
    const filePath = fileUrl.replace(
      `https://storage.googleapis.com/${this.bucketName}/`,
      '',
    );

    const bucket = this.storage.bucket(this.bucketName);
    const file = bucket.file(filePath);
    const [exists] = await file.exists();

    if (!exists) {
      throw new Error(`File not found: ${filePath}`);
    }

    await file.delete();
  }

  async deleteImages(fileUrls: string[]): Promise<void> {
    await Promise.all(fileUrls.map((url) => this.deleteImage(url)));
  }
}
