import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LogoutRequest {
  @IsString()
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjdhZDI0ZDNhLWEwNWItNDBkZi05ZGRjLTQyYTUzOTM0ZDgwZiIsImlhdCI6MTc0OTY2MTA4NSwiZXhwIjoxNzgxMjE4Njg1fQ.QCULPrvAJ7hnnA_RDth_XHfTdVoe90TjtBWrheM0mAA',
  })
  token: string;
}
