import { IQuery } from '@nestjs/cqrs'

export class CheckEmailQuery implements IQuery {
  constructor(public readonly email: string) {
  }
}
