import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditToDoDto } from './dto';
import { CreateToDoDto } from './dto/create-toDo.dto';

@Injectable()
export class ToDoService {
  constructor(private prisma: PrismaService) { }

  async createToDo(
    userId: number,
    dto: CreateToDoDto,
  ) {
    const { listId } = dto;
    const toDoList =
      await this.prisma.toDoList.findUnique({
        where: { id: listId },
      });
    if (!toDoList) {
      throw new NotFoundException(
        `ToDoList with ID ${listId} not found`,
      );
    }
    delete dto.listId;

    const toDo = await this.prisma.toDo.create({
      data: {
        ...dto,
        createdBy: { connect: { id: userId } },
        toDoList: { connect: { id: listId } },
      },
    });

    return toDo;
  }

  async editToDo(
    toDoId: number,
    userId: number,
    dto: EditToDoDto,
  ) {
    const toDo = await this.prisma.toDo.findFirst({
      where: {
        id: toDoId,
        toDoList: {
          users: {
            some: {
              id: userId,
            },
          },
        },
      },
      include: {
        toDoList: true,
      },
    });
    if (!toDo) {
      throw new NotFoundException(
        `ToDo with ID ${toDoId} not found or you do not have access to the associated ToDoList`,
      );
    }

    const updatedToDo = await this.prisma.toDo.update({
      where: { id: toDoId },
      data: { ...dto },
    });

    return updatedToDo;
  }
}
