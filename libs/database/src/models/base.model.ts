import { CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

export class BaseModel {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @CreateDateColumn({
    type: 'timestamptz',
    name: 'created_date'
  })
  createdDate: Date

  @UpdateDateColumn({
    type: 'timestamptz',
    name: 'updated_date'
  })
  updatedDate: Date

  @DeleteDateColumn({
    type: 'timestamptz',
    name: 'deleted_date'
  })
  deletedDate: Date
}
