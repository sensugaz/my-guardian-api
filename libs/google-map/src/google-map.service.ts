import { HttpService, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class GoogleMapService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
  }

  async distanceMatrix(origin: { lat: string, lng: string }[], destination: { lat: string, lng: string }[]): Promise<any> {
    const { data } = await this.httpService
      .get('https://api.distancematrix.ai/maps/api/distancematrix/json', {
        params: {
          // key: this.configService.get<string>('GOOGLE_MAP_API_KEY'),
          key: 'WwNmEk3q1Ac6b6WcgaAaDjMJczf0Z',
          departure_time: 'now',
          origins: this.addressToString(origin),
          destinations: this.addressToString(destination)
        }
      })
      .toPromise()

    console.log(this.addressToString(origin))
    console.log(this.addressToString(destination))

    return data
  }

  private addressToString(addresses: { lat: string, lng: string }[]): string {
    let addressString = ''

    addresses.forEach((value, index) => {
      if (index !== 0) {
        addressString += '|'
      }

      addressString += `${value.lat},${value.lng}`
    })

    return addressString
  }
}
