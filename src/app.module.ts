import { Module } from '@nestjs/common'
import { UserModule } from './modules'

@Module({
  imports: [UserModule],
  providers: []
})
export class AppModule {
}

