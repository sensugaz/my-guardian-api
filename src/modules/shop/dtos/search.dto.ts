import { IsNotEmpty, IsObject, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

class Geolocation {
  @IsNotEmpty()
  lat: string

  @IsNotEmpty()
  lng: string
}

export class SearchDto {
  @IsObject()
  @ValidateNested()
  @Type(() => Geolocation)
  geolocation: Geolocation
}
