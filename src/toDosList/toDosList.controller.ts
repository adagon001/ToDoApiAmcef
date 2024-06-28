import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { ToDosListService } from './toDosList.service';
import {
  CreateToDosListDto,
  EditToDosListDto,
  toDosListDtoResponse,
} from './dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiDefaultResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('toDosList')
@ApiTags('ToDosList')
export class toDosListController {
  constructor(
    private toDosListService: ToDosListService,
  ) { }

  @Get()
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: [toDosListDtoResponse],
  })
  getToDosLists(@GetUser('id') userId: number) {
    return this.toDosListService.getToDosLists(
      userId,
    );
  }

  @Get(':id')
  @ApiOkResponse({
    type: toDosListDtoResponse,
  })
  getToDosListById(
    @Param('id', ParseIntPipe) listId: number,
  ) {
    return this.toDosListService.getToDosListById(
      listId,
    );
  }

  @Post()
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({
    type: toDosListDtoResponse,
  })
  createToDoList(
    @GetUser('id') userId: number,
    @Body() dto: CreateToDosListDto,
  ) {
    return this.toDosListService.createToDoList(
      userId,
      dto,
    );
  }

  @Post(':id/share/:userId')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  async shareToDoList(
    @Param('id', ParseIntPipe) toDoListId: number,
    @Param('userId', ParseIntPipe)
    shareWithUserId: number,
    @GetUser('id') userId: number,
  ) {
    return this.toDosListService.shareToDoList(
      toDoListId,
      userId,
      shareWithUserId,
    );
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: toDosListDtoResponse,
  })
  editToDosListById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe)
    toDosListId: number,
    @Body() dto: EditToDosListDto,
  ) {
    return this.toDosListService.editToDosListById(
      userId,
      toDosListId,
      dto,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  deleteToDosListById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe)
    toDosListId: number,
  ) {
    return this.toDosListService.deleteToDosListById(
      userId,
      toDosListId,
    );
  }
}
