import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IPaginationLinks } from 'nestjs-typeorm-paginate'
import { OrderByEnum } from '@my-guardian-api/common'

export class PaginationDto {
  @ApiPropertyOptional({ default: 1 })
  page: number

  @ApiPropertyOptional({ default: 10 })
  limit: number

  @ApiPropertyOptional({ default: 'createdDate' })
  sort: string

  @ApiPropertyOptional({ default: OrderByEnum.ASC })
  orderBy: OrderByEnum
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IPaginationMeta {
}

class PaginationMeta implements IPaginationMeta {
  @ApiProperty()
  itemCount: number

  @ApiProperty()
  totalItems: number

  @ApiProperty()
  itemsPerPage: number

  @ApiProperty()
  totalPages: number

  @ApiProperty()
  currentPage: number
}

class PaginationLinks implements IPaginationLinks {
  @ApiPropertyOptional()
  first?: string

  @ApiPropertyOptional()
  previous?: string

  @ApiPropertyOptional()
  next?: string

  @ApiPropertyOptional()
  last?: string
}

class GetManyResponse<Entity> {
  readonly items: Entity[]
  readonly meta: PaginationMeta
  readonly links: PaginationLinks
}

// eslint-disable-next-line @typescript-eslint/ban-types
type Entity = Function;

export function getManyResponseFor(type: Entity): typeof GetManyResponse {
  class GetManyResponseForEntity<Entity> extends GetManyResponse<Entity> {
    @ApiProperty({ type, isArray: true })
    public items: Entity[]
  }

  Object.defineProperty(GetManyResponseForEntity, 'name', {
    value: `GetManyResponseFor${type.name}`
  })

  return GetManyResponseForEntity
}
