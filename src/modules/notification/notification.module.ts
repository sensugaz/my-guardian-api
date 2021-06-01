import { Module } from '@nestjs/common'
import { NotificationService } from './notification.service'
import { ScheduleModule } from '@nestjs/schedule'
import { CommonModule } from '@my-guardian-api/common'
import { DatabaseModule } from '@my-guardian-api/database'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BookingRepository, CustomerRepository, UserRepository } from '@my-guardian-api/database/repositories'
import { NotificationController } from './notification.controller'

@Module({
  imports: [
    CommonModule,
    DatabaseModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([
      UserRepository,
      CustomerRepository,
      BookingRepository
    ])
  ],
  controllers: [NotificationController],
  providers: [NotificationService]
})
export class NotificationModule {

}