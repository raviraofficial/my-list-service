import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonResponseDto } from '../types';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, { body: CommonResponseDto<T> }>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<{ body: CommonResponseDto<T> }> {
    return next.handle().pipe(
      map((data) => {
        return {
          body: new CommonResponseDto('Completed successfully', data),
        };
      }),
    );
  }
}
