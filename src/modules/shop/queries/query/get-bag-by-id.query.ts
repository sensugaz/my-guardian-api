import { IQuery } from '@nestjs/cqrs'

export class GetBagByIdQuery implements IQuery {
  constructor(public readonly userId: string,
              public readonly bagId: string) {
  }
}
