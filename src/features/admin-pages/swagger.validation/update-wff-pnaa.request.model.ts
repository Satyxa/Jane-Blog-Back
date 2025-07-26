import { ApiProperty } from '@nestjs/swagger';
import { PageType } from '../db/wff-pnaa-pages.model';

export class UpdateWFFPNAARequest {
  @ApiProperty({ example: 'some title', type: String })
  title: string;

  @ApiProperty({ example: 'some story', type: String })
  text: string;

  @ApiProperty({ example: 'wff', enum: PageType })
  pageType: PageType;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    required: false,
  })
  images: Express.Multer.File[];
}
