import { Test, TestingModule } from '@nestjs/testing';
import { MyListController } from './my-list.controller';
import { MyListService } from './my-list.service';
import { AddItemDto, ListItemQueryDto } from './dto';
import { ContentType } from './enums';

describe('MyListController', () => {
  let controller: MyListController;
  let service: MyListService;

  const mockMyListService = {
    addItemToMyList: jest.fn(),
    listMyItems: jest.fn(),
    removeFromList: jest.fn(),
  };

  const mockUser = { id: 'mockUserId123' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MyListController],
      providers: [
        {
          provide: MyListService,
          useValue: mockMyListService,
        },
      ],
    }).compile();

    controller = module.get<MyListController>(MyListController);
    service = module.get<MyListService>(MyListService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addItem', () => {
    it('should call service.addItem with correct params', async () => {
      const dto: AddItemDto = {
        contentId: '12345',
        contentType: ContentType.Movie,
      };

      const req = { user: mockUser };
      const expectedResult = { id: 'new-item' };

      mockMyListService.addItemToMyList.mockResolvedValue(expectedResult);

      const result = await controller.addItemToMyList(dto, req);
      expect(service.addItemToMyList).toHaveBeenCalledWith(dto, mockUser.id);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getList', () => {
    it('should call service.getUserList with correct params', async () => {
      const query: ListItemQueryDto = { page: 1, limit: 10 };
      const req = { user: mockUser };
      const expectedResult = [{ contentId: 'a', contentType: 'Movie' }];

      mockMyListService.listMyItems.mockResolvedValue(expectedResult);

      const result = await controller.listMyItems(query, req);
      expect(service.listMyItems).toHaveBeenCalledWith(mockUser.id, 1, 10);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('removeItem', () => {
    it('should call service.removeFromList with correct params', async () => {
      const contentId = 'content123';
      const req = { user: mockUser };
      const expectedResult = { deleted: true };

      mockMyListService.removeFromList.mockResolvedValue(expectedResult);

      const result = await controller.removeFromList(contentId, req);
      expect(service.removeFromList).toHaveBeenCalledWith(
        mockUser.id,
        contentId,
      );
      expect(result).toEqual(expectedResult);
    });
  });
});
