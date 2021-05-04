import { IsEmail, IsNotEmpty } from 'class-validator'

export class CreateShopDto {
  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  password: string
}