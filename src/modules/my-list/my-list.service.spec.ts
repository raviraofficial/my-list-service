import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { MyListService } from './my-list.service';
import { MyList } from 'src/schemas/mylist.schema';
import { HttpException, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { AddItemDto } from './dto';
import { ContentType } from './enums';

describe('MyListService', () => {
  let service: MyListService;
  let model: Model<MyList>;

  const mockMyListModel = {
    create: jest.fn(),
    find: jest.fn(),
    countDocuments: jest.fn(),
    deleteOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MyListService,
        {
          provide: getModelToken(MyList.name),
          useValue: mockMyListModel,
        },
      ],
    }).compile();

    service = module.get<MyListService>(MyListService);
    model = module.get<Model<MyList>>(getModelToken(MyList.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addItemToMyList', () => {
    it('should add item to the list successfully', async () => {
      const dto: AddItemDto = {
        contentId: '123',
        contentType: ContentType.Movie,
      };
      const mockCreatedItem = { ...dto, userId: 'user1' };

      (model.create as jest.Mock).mockResolvedValue(mockCreatedItem);

      const result = await service.addItemToMyList(dto, 'user1');
      expect(model.create).toHaveBeenCalledWith({ ...dto, userId: 'user1' });
      expect(result).toEqual(mockCreatedItem);
    });

    it('should throw conflict if item already exists', async () => {
      const dto: AddItemDto = {
        contentId: '123',
        contentType: ContentType.Movie,
      };

      (model.create as jest.Mock).mockRejectedValue({ code: 11000 });

      await expect(service.addItemToMyList(dto, 'user1')).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('listMyItems', () => {
    it('should return paginated items', async () => {
      const items = [{ contentId: '1' }, { contentId: '2' }];
      const count = 2;

      (model.find as jest.Mock).mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(items),
      } as any);
      (model.countDocuments as jest.Mock).mockResolvedValue(count);

      const result = await service.listMyItems('user1', 1, 2);

      expect(result).toEqual({
        total: count,
        page: 1,
        limit: 2,
        items,
      });
    });
  });

  describe('removeFromList', () => {
    it('should remove item from list', async () => {
      (model.deleteOne as jest.Mock).mockResolvedValue({ deletedCount: 1 });

      await expect(
        service.removeFromList('user1', 'content1'),
      ).resolves.toBeUndefined();
    });

    it('should throw NotFoundException if item not found', async () => {
      (model.deleteOne as jest.Mock).mockResolvedValue({ deletedCount: 0 });

      await expect(service.removeFromList('user1', 'content1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
