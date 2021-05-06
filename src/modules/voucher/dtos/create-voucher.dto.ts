import { IsNotEmpty, IsNumber } from 'class-validator'

export class CreateVoucherDto {
  @IsNotEmpty()
  code: string

  @IsNotEmpty()
  name: string

  description: string

  @IsNotEmpty()
  @IsNumber()
  percent: number
}