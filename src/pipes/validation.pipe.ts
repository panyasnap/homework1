import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { ValidationException } from 'src/exaptions/validation.exaption';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    const obj = plainToClass(metadata.metatype, value);
    if (typeof value === 'string') return value;

    const errors = await validate(obj);

    if (errors.length) {
      /**
       * нужно нормализовать отсылаемые данные на клиент
       * просто массив не подходит, т.к не понятно какая ошибка к какому полю относится
       */
      const message = errors.map((err) => {
        return { [err.property]: Object.values(err.constraints).join(', ') };
      });
      throw new ValidationException(message);
    }
    return value;
  }
}
