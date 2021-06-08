import { Injectable, Logger } from '@nestjs/common'
import * as FCM from 'fcm-push'
import { ConfigService } from '@nestjs/config'
import { Cron } from '@nestjs/schedule'
import { InjectRepository } from '@nestjs/typeorm'
import { BookingRepository, UserRepository } from '@my-guardian-api/database/repositories'
import { BookingBagStatusEnum } from '@my-guardian-api/common'
import * as moment from 'moment-timezone'
import { Not } from 'typeorm'

@Injectable()
export class NotificationService {
  fmc: FCM

  constructor(private readonly configService: ConfigService,
              @InjectRepository(UserRepository)
              private readonly userRepository: UserRepository,
              @InjectRepository(BookingRepository)
              private readonly bookingRepository: BookingRepository) {
    this.fmc = new FCM(this.configService.get<string>('SERVER_KEY'))
  }

  @Cron('60 * * * * *')
  async handleCron() {
    const bookings = await this.bookingRepository.find({
      where: {
        bookingBagStatus: BookingBagStatusEnum.DROPPED,
        notificationTime: Not(5)
      },
      relations: ['customer']
    })

    const day = moment().format('dddd')

    for (const booking of bookings) {
      if (booking.scheduleDay === day.toUpperCase() && booking.scheduleOpenTime !== null && booking.scheduleCloseTime !== null) {
        const start = moment()
        const end = moment(booking.scheduleCloseTime, 'HH.mm')
        const duration = moment.duration(end.diff(start))
        const minute = duration.asMinutes()
        const user = await this.userRepository.findOne({
          id: booking?.customer?.userId
        })

        if (user.deviceId) {
          if (Math.floor(minute) === 5 && booking.notificationTime === '30') {
            Logger.debug('5')
            booking.setNotificationTime('5')
            await this.bookingRepository.save(booking)

            await this.fmc.send({
              to: user.deviceId,
              data: {
                bookingId: booking.id
              },
              notification: {
                title: 'Retrait MyGuardian',
                body: 'Votre commerçant ferme dans moins de 5 minutes. Pensez à retirer vos équipements.'
              }
            })
          } else if (Math.floor(minute) === 30 && booking.notificationTime === '60') {
            Logger.debug('30')
            booking.setNotificationTime('30')
            await this.bookingRepository.save(booking)

            await this.fmc.send({
              to: user.deviceId,
              data: {
                bookingId: booking.id
              },
              notification: {
                title: 'Retrait MyGuardian',
                body: 'Votre commerçant ferme dans moins de 30 minutes. Pensez à retirer vos équipements.'
              }
            })
          } else if (Math.floor(minute) === 60 && !booking.notificationTime) {
            Logger.debug('60')
            booking.setNotificationTime('60')
            await this.bookingRepository.save(booking)

            await this.fmc.send({
              to: user.deviceId,
              data: {
                bookingId: booking.id
              },
              notification: {
                title: 'Retrait MyGuardian',
                body: 'Votre commerçant ferme dans moins d\'une heure. Pensez à retirer vos équipements.'
              }
            })
          }
        }
      }
    }
  }
}