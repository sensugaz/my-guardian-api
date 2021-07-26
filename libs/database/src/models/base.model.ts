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
    transformer: {
      to(value: Date): any {
        if (!value) {
          return moment().add(2, 'hours').toDate()
        }
        return moment(value).add(2, 'hours').toDate()
      },
      from(value: Date): any {
        return value
      },
    },
  })
  createdDate: string

  @UpdateDateColumn({
    type: 'timestamp with time zone',
    name: 'updated_date',
    transformer: {
      to(value: Date): any {
        if (!value) {
          return moment().add(2, 'hours').toDate()
        }
        return moment(value).add(2, 'hours').toDate()
      },
      from(value: Date): any {
        return value
      },
    },
  })
  updatedDate: Date

  @DeleteDateColumn({
    type: 'timestamp',
    name: 'deleted_date',
    transformer: {
      to(value: Date): any {
        if (value) {
          return moment().add(2, 'hours').toDate()
        }

        return value
      },
      from(value: Date): any {
        return value
      },
    },
  })
  deletedDate: Date
}
