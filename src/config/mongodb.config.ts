import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MongodbConfig implements MongooseOptionsFactory {
  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: process.env.DATABASE_URL,
      retryAttempts: 3,
      retryDelay: 1000,
    };
  }
}
