import { IsNotEmpty, IsNumber } from 'class-validator'

export class UpdateVoucherDto {
  @IsNotEmpty()
  name: string

  description: string

  @IsNotEmpty()
  @IsNumber()
  percent: number
}
