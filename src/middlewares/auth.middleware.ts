import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Simulate authentication by adding a user object to the request
    // In a real application, you would verify a token or session here
    req['user'] = { id: '6611f14e23e7c1dbf9b70123' };
    next();
  }
}
