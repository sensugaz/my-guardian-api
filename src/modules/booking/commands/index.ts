import { CancelHandler, CheckoutHandler, DroppedHandler, WithdrawHandler } from './handler'

export const CommandHandlers = [CheckoutHandler, DroppedHandler, WithdrawHandler, CancelHandler]
