import { Injectable } from '@nestjs/common'
import * as Mail from 'nodemailer/lib/mailer'
import * as hbs from 'nodemailer-express-handlebars'
import { ConfigService } from '@nestjs/config'
import * as nodemailer from 'nodemailer'
import { SentMessageInfo } from 'nodemailer'
import { join } from 'path'

@Injectable()
export class MailerService {
  private transporter: Mail

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: configService.get<string>('SMTP_HOST'),
      port: configService.get<number>('SMTP_PORT'),
      secure: true,
      auth: {
        user: configService.get<string>('SMTP_USER'),
        pass: configService.get<string>('SMTP_PASS')
      }
    })
  }

  send(to: string, subject: string, content: string): Promise<SentMessageInfo> {
    const mailOptions = {
      from: this.configService.get<string>('SMTP_USER'),
      to,
      subject,
      html: content
    }

    return this.transporter.sendMail(mailOptions)
  }


  sendWithTemplate(to: string, subject: string, context: any, template: string): Promise<SentMessageInfo> {
    this.transporter.use('compile', hbs({
      viewEngine: {
        extName: '.hbs',
        partialsDir: join(__dirname, 'templates'),
        layoutsDir: join(__dirname, 'templates'),
        defaultLayout: ''
      },
      viewPath: join(__dirname, 'templates'),
      extName: '.hbs'
    }))

    const mailOptions = {
      from: this.configService.get<string>('SMTP_USER'),
      to,
      subject,
      context: { context },
      template
    }

    return this.transporter.sendMail(mailOptions)
  }
}
