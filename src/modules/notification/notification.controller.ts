import { Body, Controller, Post } from '@nestjs/common'
import { ApiProperty, ApiTags } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'
import * as FCM from 'fcm-push'

export class NotificationDto {
  @ApiProperty()
  deviceToken: string
  @ApiProperty()
  bookingId: string
}

@ApiTags('notification')
@Controller('/notification')
export class NotificationController {
  constructor(private readonly configService: ConfigService) {
  }

  @Post()
  index(@Body() body: NotificationDto) {
    const fmc = new FCM(this.configService.get<string>('SERVER_KEY'))
    const message = {
      to: body.deviceToken, // required fill with device token or `/topics/${topicName}`
      data: {
        bookingId: body.bookingId
      },
      notification: {
        title: 'Title of your push notification',
        body: 'Body of your push notification'
      }
    }

    return fmc.send(message)
  }
}