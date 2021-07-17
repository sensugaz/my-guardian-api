import { CreateBagHandler, CreateShopHandler, DeleteBagHandler, DeleteShopHandler, UpdateShopHandler } from './handler'

export const CommandHandlers = [
  CreateShopHandler,
  UpdateShopHandler,
  DeleteShopHandler,
  CreateBagHandler,
  DeleteBagHandler
]
