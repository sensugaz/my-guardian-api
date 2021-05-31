import { IQuery } from '@nestjs/cqrs'

export class CheckTokenQuery implements IQuery {
  constructor(public readonly query: string) {
  }
}
