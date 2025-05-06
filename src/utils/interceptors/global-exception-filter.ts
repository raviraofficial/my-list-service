import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import mongoose from 'mongoose';

type ExceptionResponse = {
  message: string | string[];
  data?: Record<string, unknown>;
};

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Default status code
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal Server Error';
    let data: Record<string, unknown> | undefined;

    // Handle HTTP exceptions (thrown by class-validator or manually)
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseBody = exception.getResponse();

      if (typeof responseBody === 'string') {
        message = responseBody;
      } else if (
        typeof responseBody === 'object' &&
        'message' in responseBody
      ) {
        const { message: errorMessage, data: additionaData } =
          responseBody as ExceptionResponse;
        message = errorMessage;
        data = additionaData;
      }
    }

    // Handle Mongoose Validation Errors
    else if (exception instanceof mongoose.Error.ValidationError) {
      status = HttpStatus.BAD_REQUEST;
      message = Object.values(exception.errors).map((err) => err.message);
    }

    // Unhandled exception fallback
    else {
      console.error('Unhandled exception:', exception);
    }

    response.status(status).json({
      statusCode: status,
      message,
      ...(data ? { data } : {}),
      timestamp: new Date().toISOString(),
    });
  }
}
