import { Column, Entity } from 'typeorm'
import { BaseModel } from '@my-guardian-api/database/models/base.model'

@Entity('configs')
export class ConfigModel extends BaseModel {
  @Column({
    name: 'search_radius'
  })
  searchRadius: number
}
