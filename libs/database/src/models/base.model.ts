import { CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

export class BaseModel {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_date'
  })
  createDate: Date

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_date'
  })
  updateDate: Date
  
  @DeleteDateColumn({
    type: 'timestamp',
    name: 'deleted_date'
  })
  deletedDate: Date
}
