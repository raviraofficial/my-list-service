import {
  Injectable,
  NotFoundException,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MyList } from 'src/schemas/mylist.schema';
import { AddItemDto } from './dto';

@Injectable()
export class MyListService {
  constructor(
    @InjectModel(MyList.name)
    private myListModel: Model<MyList>,
  ) {}

  async addItemToMyList(addItemRequest: AddItemDto, userId: string) {
    try {
      return await this.myListModel.create({ ...addItemRequest, userId });
    } catch (err) {
      if ((err as { code: number }).code === 11000) {
        throw new HttpException(
          'Item already exists in the user list',
          HttpStatus.CONFLICT,
        );
      }
      throw err;
    }
  }

  async listMyItems(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.myListModel
        .find({ userId })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
      this.myListModel.countDocuments({ userId }),
    ]);

    return {
      total,
      page,
      limit,
      items,
    };
  }

  async removeFromList(userId: string, contentId: string): Promise<void> {
    const result = await this.myListModel.deleteOne({ userId, contentId });
    if (result.deletedCount === 0) {
      throw new NotFoundException('Item not found in the user list');
    }
    return;
  }
}
