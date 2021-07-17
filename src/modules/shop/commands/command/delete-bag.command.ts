import { ICommand } from '@nestjs/cqrs'

export class DeleteBagCommand implements ICommand {
  constructor(public readonly userId: string,
              public readonly bagId: string) {
  }
}
