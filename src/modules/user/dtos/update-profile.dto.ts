import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateProfileDto {
  @IsNotEmpty()
  @ApiProperty()
  firstName: string

  @IsNotEmpty()
  @ApiProperty()
  lastName: string

  @IsNotEmpty()
  @ApiProperty()
  phoneCode: string

  @IsNotEmpty()
  @ApiProperty()
  phoneNumber: string
}