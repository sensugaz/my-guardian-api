import {
  ArgumentMetadata,
  HttpStatus,
  Injectable,
  PipeTransform,
  Type,
} from '@nestjs/common'
import { validate, ValidationError } from 'class-validator'
import { plainToClass } from 'class-transformer'
import { ApiException } from '@my-guardian-api/common/exceptions'

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  getCodes(validationErrors: ValidationError[]) {
    return validationErrors.reduce((prev, current) => {
      const errorKey = current.constraints
        ? Object.values(current.constraints)
        : this.getCodes(current.children)
      return [...prev, errorKey]
    }, [])
  }

  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value
    }

    const object = plainToClass(metatype, value)
    const errors = await validate(object)

    if (errors.length > 0) {
      const codes = this.getCodes(errors)
      throw new ApiException({
        type: 'validation',
        codes: codes.reduce((prev, curr) => [...prev, ...curr], []),
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      })
    }
    return value
  }

  private toValidate = (metatype: Type<any>): boolean => {
    // eslint-disable-next-line @typescript-eslint/ban-types
    const types: Function[] = [String, Boolean, Number, Array, Object]
    // eslint-disable-next-line @typescript-eslint/ban-types
    return !types.includes(<Function>metatype)
  }
}
