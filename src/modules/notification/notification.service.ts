import { Injectable, Logger } from '@nestjs/common'
import * as FCM from 'fcm-push'
import { ConfigService } from '@nestjs/config'
import { Cron } from '@nestjs/schedule'
import { InjectRepository } from '@nestjs/typeorm'
import { BookingRepository, ShopScheduleRepository, UserRepository } from '@my-guardian-api/database/repositories'
import { BookingBagStatusEnum, BookingStatusEnum } from '@my-guardian-api/common'
import * as moment from 'moment-timezone'
import { Brackets } from 'typeorm'

@Injectable()
export class NotificationService {
  fmc: FCM

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    @InjectRepository(BookingRepository)
    private readonly bookingRepository: BookingRepository,
    @InjectRepository(ShopScheduleRepository)
    private readonly shopScheduleRepository: ShopScheduleRepository
  ) {
    this.fmc = new FCM(this.configService.get<string>('SERVER_KEY'))
  }

  @Cron('60 * * * * *')
  async handleCron() {
    const bookings = await this.bookingRepository
      .createQueryBuilder('bookings')
      .innerJoinAndSelect('bookings.customer', 'customer')
      .innerJoinAndSelect('bookings.shop', 'shop')
      .where('bookings.booking_status = :bookingStatus', {
        bookingStatus: BookingStatusEnum.COMPLETED
      })
      .andWhere(
        new Brackets((qb) => {
          qb.where('bookings.booking_bag_status = :bookingBagStatus', {
            bookingBagStatus: BookingBagStatusEnum.DROPPED
          })
        })
      )
      .getMany()

    const day = moment().format('dddd')

    for (const booking of bookings) {
      const shopSchedule = await this.shopScheduleRepository.findOne({
        where: {
          day: day.toUpperCase(),
          shop: {
            id: booking.shop.id
          }
        }
      })

      if (shopSchedule && !shopSchedule.isClose) {
        const start = moment()
        const [scheduleCloseHour, scheduleCloseMinute] =
          shopSchedule.closeTime.split(':')
        const end = moment()
          .hour(Number(scheduleCloseHour))
          .minute(Number(scheduleCloseMinute))
        const duration = moment.duration(end.diff(start))
        const minute = duration.asMinutes()

        if (minute > 0) {
          const user = await this.userRepository.findOne({
            id: booking?.customer?.userId
          })

          if (user && user.deviceId) {
            if (Math.floor(minute) === 5) {
              booking.setNotificationTime(start.format())
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
              Logger.debug('Fire Noti: 5')
            } else if (Math.floor(minute) === 30) {
              booking.setNotificationTime(start.format())
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
              Logger.debug('Fire Noti: 30')
            } else if (Math.floor(minute) === 60) {
              booking.setNotificationTime(start.format())
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
              Logger.debug('Fire Noti: 60')
            }
          }
        }
      }
    }
  }
}
