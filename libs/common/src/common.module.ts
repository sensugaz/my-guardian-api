import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { CqrsModule } from '@nestjs/cqrs'
import { APP_FILTER, APP_PIPE } from '@nestjs/core'
import { ApiExceptionFilter } from '@my-guardian-api/common/filters'
import { ValidationPipe } from '@my-guardian-api/common/pipes'

@Module({
  imports: [
    ConfigModule.forRoot(),
    CqrsModule
  ],
  exports: [
    ConfigModule,
    CqrsModule
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe
    },
    {
      provide: APP_FILTER,
      useClass: ApiExceptionFilter
    }
  ]
})
export class CommonModule {
}