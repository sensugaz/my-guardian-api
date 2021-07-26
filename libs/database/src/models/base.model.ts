import { CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import * as moment from 'moment-timezone'

export class BaseModel {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @CreateDateColumn({
    type: 'timestamp without time zone',
    name: 'created_date',
    transformer: {
      to(value: any): any {
        return value
      },
      from(value: any): any {
        if (value) {
          return moment(value).add(2, 'hours')
        }

        return value
      }
    }
  })
  createdDate: Date

  @UpdateDateColumn({
    type: 'timestamp without time zone',
    name: 'updated_date',
    nullable: true,
    transformer: {
      to(value: any): any {
        return value
      },
      from(value: any): any {
        if (value) {
          return moment(value).add(2, 'hours')
        }

        return value
      }
    }
  })
  updatedDate: Date

  @DeleteDateColumn({
    type: 'timestamp without time zone',
    name: 'deleted_date',
    transformer: {
      to(value: any): any {
        return value
      },
      from(value: any): any {
        if (value) {
          return moment(value).add(2, 'hours')
        }

        return value
      }
    }
  })
  deletedDate: Date
}
