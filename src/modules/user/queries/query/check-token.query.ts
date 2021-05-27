import { IQuery } from '@nestjs/cqrs'
import { CheckTokenDto } from '../../dtos'

export class CheckTokenQuery implements IQuery {
  constructor(public readonly query: CheckTokenDto) {}
}
