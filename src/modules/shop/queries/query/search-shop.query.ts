import { IQuery } from '@nestjs/cqrs'
import { SearchDto } from '../../dtos'

export class SearchShopQuery implements IQuery {
  constructor(public readonly body: SearchDto) {}
}
