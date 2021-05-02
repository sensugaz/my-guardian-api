import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class ActivateDto {
  @IsNotEmpty()
  @ApiProperty()
  token: string
}