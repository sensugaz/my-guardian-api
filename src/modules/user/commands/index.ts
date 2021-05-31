import {
  ActivateHandler,
  ChangePasswordHandler,
  DeleteUserHandler,
  ForgotPasswordHandler,
  LoginHandler,
  RegisterHandler,
  ResetPasswordHandler,
  UpdateDeviceIdHandler,
  UpdateProfileHandler
} from './handler'

export const CommandHandlers = [
  RegisterHandler,
  ActivateHandler,
  ForgotPasswordHandler,
  ResetPasswordHandler,
  LoginHandler,
  ChangePasswordHandler,
  DeleteUserHandler,
  UpdateProfileHandler,
  UpdateDeviceIdHandler
]
