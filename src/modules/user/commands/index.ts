import {
  ActivateHandler,
  ChangePasswordHandler,
  DeleteUserHandler,
  ForgotPasswordHandler,
  LoginHandler,
  RegisterHandler,
  ResetPasswordHandler
} from './handler'

export const CommandHandlers = [
  RegisterHandler,
  ActivateHandler,
  ForgotPasswordHandler,
  ResetPasswordHandler,
  LoginHandler,
  ChangePasswordHandler,
  DeleteUserHandler
]