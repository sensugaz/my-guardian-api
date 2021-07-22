import { CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

export class BaseModel {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @CreateDateColumn({
    type: 'timestamp with local time zone',
    name: 'created_date'
  })
  createdDate: Date

  @UpdateDateColumn({
    type: 'timestamp with local time zone',
    name: 'updated_date'
  })
  updatedDate: Date

  @DeleteDateColumn({
    type: 'timestamp with local time zone',
    name: 'deleted_date'
  })
  deletedDate: Date
}
