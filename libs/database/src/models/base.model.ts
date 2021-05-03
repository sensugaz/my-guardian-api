import { CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

export class BaseModel {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @CreateDateColumn({
    type: 'timestamp without time zone',
    name: 'created_date'
  })
  createdDate: Date

  @UpdateDateColumn({
    type: 'timestamp without time zone',
    name: 'updated_date'
  })
  updatedDate: Date

  @DeleteDateColumn({
    type: 'timestamp without time zone',
    name: 'deleted_date'
  })
  deletedDate: Date
}
