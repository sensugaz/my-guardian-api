import { HttpService, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class GoogleMapService {
  constructor(private readonly httpService: HttpService,
              private readonly configService: ConfigService) {
  }

  async distance(from: { lat: string, lng: string }, to: { lat: string, lng: string }): Promise<number> {
    const { data } = await this.httpService.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
      params: {
        key: this.configService.get<string>('GOOGLE_MAP_API_KEY'),
        departure_time: 'now',
        origins: `${from.lat},${from.lng}`,
        destinations: `${to.lat},${to.lng}`
      }
    }).toPromise()

    let distance = 0

    if (data.status === 'OK') {
      for (const row of data.rows) {
        for (const element of row.elements) {
          distance += element.distance?.value
        }
      }
    }

    return distance
  }
}
