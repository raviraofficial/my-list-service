import {
  Controller,
  Post,
  Body,
  Req,
  Get,
  Query,
  Delete,
  Param,
} from '@nestjs/common';
import { MyListService } from './my-list.service';
import { AddItemDto, ListItemQueryDto } from './dto';
import { AuthRequest } from 'src/utils/types';

@Controller('my-list')
export class MyListController {
  constructor(private readonly myListService: MyListService) {}

  @Post()
  addItemToMyList(@Body() body: AddItemDto, @Req() req: AuthRequest) {
    return this.myListService.addItemToMyList(body, req.user.id);
  }
  @Get()
  listMyItems(@Query() query: ListItemQueryDto, @Req() req: AuthRequest) {
    return this.myListService.listMyItems(req.user.id, query.page, query.limit);
  }
  @Delete(':id')
  removeFromList(@Param('id') contentId: string, @Req() req: AuthRequest) {
    return this.myListService.removeFromList(req.user.id, contentId);
  }
}
