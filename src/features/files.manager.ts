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
    const credentials = JSON.parse(this.configService.get('GCS_CREDENTIALS')!);
    this.storage = new Storage({ credentials });
  }

  async uploadImage(
    fileBuffer: Buffer,
    originalName: string,
    folder: string,
    postId: string | null,
  ): Promise<string> {
    const parts = originalName.split('.');
    const extension = parts.length > 1 ? `.${parts.pop()}` : '.jpg';
    const path = postId ? `${folder}/${postId}` : `${folder}/`;
    const fileName = `${path}/${uuid.v4()}${extension}`;
    const bucket = this.storage.bucket(this.bucketName);
    const file = bucket.file(fileName);
    await file.save(fileBuffer, {
      contentType: mime.lookup(extension) || 'image/jpeg',
      resumable: false,
    });
    console.log('Uploading to:', fileName);
    return `https://storage.googleapis.com/${this.bucketName}/${fileName}`;
  }

  async uploadImages(
    files: Express.Multer.File[],
    folder: PageType | 'posts/images',
    postId: string | null,
  ): Promise<string[]> {
    if (files.length > 10) {
      throw new BadRequestException({
        field: 'images',
        message: 'Cannot upload more than 10 images',
      });
    }
    const path = postId ? `${folder}/${postId}` : `${folder}/`;

    const bucket = this.storage.bucket(this.bucketName);

    const [existingFiles] = await bucket.getFiles({ prefix: `${path}` });

    if (existingFiles.length > 0) {
      await Promise.all(existingFiles.map((file) => file.delete()));
    }
    let urls: string[] = [];

    if (files.length > 0) {
      urls = await Promise.all(
        files.map((file) =>
          this.uploadImage(file.buffer, file.originalname, folder, postId),
        ),
      );
    }

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
    console.log(fileUrl);
    const url = new URL(fileUrl);
    const filePath = decodeURIComponent(
      url.pathname.replace(`/${this.bucketName}/`, ''),
    );
    console.log('Deleting file at path:', filePath);

    const bucket = this.storage.bucket(this.bucketName);
    const [files] = await bucket.getFiles({ prefix: 'posts/poster/' });
    console.log(
      'Files in folder:',
      files.map((f) => f.name),
    );
    console.log(bucket.name);
    const file = bucket.file(filePath);
    const [exists] = await file.exists();

    if (!exists) {
      throw new Error(`File not found: ${filePath}`);
    }

    await file.delete();
  }

  async deleteImages(fileUrls: string[]): Promise<void> {
    console.log(fileUrls);
    await Promise.all(fileUrls.map((url) => this.deleteImage(url)));
  }
}
