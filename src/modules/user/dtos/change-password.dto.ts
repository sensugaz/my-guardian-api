import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class ChangePasswordDto {
  @IsNotEmpty()
  @ApiProperty()
  oldPassword: string

  @IsNotEmpty()
  @ApiProperty()
  newPassword: string
}
