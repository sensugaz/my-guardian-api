import { HttpModule, Module } from '@nestjs/common'
import { GoogleMapService } from './google-map.service'
import { CommonModule } from '@my-guardian-api/common'

@Module({
  imports: [
    CommonModule,
    HttpModule
  ],
  providers: [GoogleMapService],
  exports: [GoogleMapService]
})
export class GoogleMapModule {
}
