import { IQuery } from '@nestjs/cqrs'

export class GetVoucherByIdQuery implements IQuery {
  constructor(public readonly id: string) {}
}
