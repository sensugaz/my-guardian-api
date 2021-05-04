import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  ValidateNested
} from 'class-validator'
import { Type } from 'class-transformer'
import { DayEnum } from '@my-guardian-api/common'

class Geolocation {
  @IsNotEmpty()
  lat: string

  @IsNotEmpty()
  lng: string
}

class Price {
  @IsNotEmpty()
  name: string

  @IsNumber()
  price: number
}

class Schedule {
  @IsNotEmpty()
  @IsEnum(DayEnum)
  day: DayEnum

  // @IsNotEmpty()
  openTime: string

  // @IsNotEmpty()
  closeTime: string

  @IsNotEmpty()
  isClose: boolean
}

export class CreateShopDto {
  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  password: string

  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  address: string

  @IsNotEmpty()
  @IsNumber()
  available: number

  @IsObject()
  @ValidateNested()
  @Type(() => Geolocation)
  geolocation: Geolocation

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(7)
  @ArrayMaxSize(7)
  @ValidateNested()
  @Type(() => Schedule)
  schedules: Schedule[]

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested()
  @Type(() => Price)
  prices: Price[]
}