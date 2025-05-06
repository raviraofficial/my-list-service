import { Module } from '@nestjs/common';
import { MyListController } from './my-list.controller';
import { MyListService } from './my-list.service';
import { MyListSchema } from 'src/schemas/mylist.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'MyList', schema: MyListSchema }]),
  ],
  controllers: [MyListController],
  providers: [MyListService],
})
export class MyListModule {}
