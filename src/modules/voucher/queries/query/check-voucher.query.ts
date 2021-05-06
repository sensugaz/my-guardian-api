import { IQuery } from '@nestjs/cqrs'

export class CheckVoucherQuery implements IQuery {
  constructor(public readonly code: string) {
  }
}