import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
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

  @IsNumber()
  qty: number
}

class Schedule {
  @IsNotEmpty()
  @IsEnum(DayEnum)
  day: DayEnum

  // @IsNotEmpty()
  openTime: string

  // @IsNotEmpty()
  closeTime: string

  openTimeEnd: string

  closeTimeStart: string

  @IsNotEmpty()
  isClose: boolean
}

export class UpdateShopDto {
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

  @IsOptional()
  description: string

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
