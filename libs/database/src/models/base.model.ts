import { CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

export class BaseModel {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @CreateDateColumn({
    type: 'timestamp without time zone',
    name: 'created_date'
  })
  createDate: Date

  @UpdateDateColumn({
    type: 'timestamp without time zone',
    name: 'updated_date'
  })
  updateDate: Date

  @DeleteDateColumn({
    type: 'timestamp without time zone',
    name: 'deleted_date'
  })
  deletedDate: Date
}
