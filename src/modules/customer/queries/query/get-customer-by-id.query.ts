import { IQuery } from '@nestjs/cqrs'

export class GetCustomerByIdQuery implements IQuery {
  constructor(public readonly userId: string) {}
}
