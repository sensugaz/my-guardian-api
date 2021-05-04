import { IQuery } from '@nestjs/cqrs'

export class GetShopByIdQuery implements IQuery {
  constructor(public readonly userId: string) {
  }
}