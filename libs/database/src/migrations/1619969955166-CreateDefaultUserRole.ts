import { MigrationInterface, QueryRunner } from 'typeorm'
import { RoleModel } from '@my-guardian-api/database/models/role.model'
import { RoleEnum } from '@my-guardian-api/common'

export class CreateDefaultUserRole1619969955166 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const repository = queryRunner.manager.getRepository(RoleModel)

    const defaultRole = await repository.create([
      {
        key: RoleEnum.ADMIN,
        value: 'Admin'
      },
      {
        key: RoleEnum.CUSTOMER,
        value: 'Customer'
      },
      {
        key: RoleEnum.SHOP,
        value: 'Shop'
      }
    ])

    await repository.save([...defaultRole])
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
  }
}
