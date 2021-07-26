import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import * as moment from 'moment-timezone'

export class BaseModel {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @CreateDateColumn({
    type: 'timestamp with time zone',
    name: 'created_date',
  })
  createdDate: string

  @UpdateDateColumn({
    type: 'timestamp with time zone',
    name: 'updated_date',
  })
  updatedDate: Date

  @DeleteDateColumn({
    type: 'timestamp',
    name: 'deleted_date',
  })
  deletedDate: Date
}
