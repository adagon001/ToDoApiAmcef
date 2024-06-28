import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateToDosListDto,
  EditToDosListDto,
} from './dto';

@Injectable()
export class ToDosListService {
  constructor(private prisma: PrismaService) { }

  getToDosLists(userId: number) {
    return this.prisma.toDoList.findMany({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
      },
      include: { toDos: true }
    });
  }

  async getToDosListById(listId: number) {
    const toDoList =
      await this.prisma.toDoList.findUnique({
        where: { id: listId },
        include: {
          toDos: true,
        },
      });
    if (!toDoList)
      throw new NotFoundException(
        `ToDoList with ID ${listId} not found`,
      );

    return toDoList;
  }

  async createToDoList(
    userId: number,
    dto: CreateToDosListDto,
  ) {
    const toDoList =
      await this.prisma.toDoList.create({
        data: {
          title: dto.title,
          users: { connect: { id: userId } },
        },
        include: { toDos: true }
      });

    return toDoList;
  }

  async editToDosListById(
    userId: number,
    toDosListId: number,
    dto: EditToDosListDto,
  ) {
    const toDoList =
      await this.prisma.toDoList.findUnique({
        where: {
          id: toDosListId,
        },
        include: {
          users: true,
        },
      });

    if (
      !toDoList ||
      !toDoList.users.some(
        (user) => user.id === userId,
      )
    )
      throw new ForbiddenException(
        'Access to resources denied',
      );

    return await this.prisma.toDoList.update({
      where: {
        id: toDosListId,
      },
      data: {
        ...dto,
      },
      include: { toDos: true }
    });
  }

  async deleteToDosListById(
    userId: number,
    toDosListId: number,
  ) {
    const toDoList =
      await this.prisma.toDoList.findUnique({
        where: {
          id: toDosListId,
        },
        include: {
          users: true,
        },
      });

    if (
      !toDoList ||
      !toDoList.users.some(
        (user) => user.id === userId,
      )
    )
      throw new ForbiddenException(
        'Access to resources denied',
      );
    await this.prisma.toDoList.delete({
      where: {
        id: toDosListId,
      },
    });
  }

  async shareToDoList(
    toDoListId: number,
    userId: number,
    shareWithUserId: number,
  ) {
    const toDoList =
      await this.prisma.toDoList.findUnique({
        where: { id: toDoListId },
        include: { users: true },
      });
    if (!toDoList)
      throw new NotFoundException(
        `ToDoList with ID ${toDoListId} not found`,
      );

    const isUserAssociated = toDoList.users.some(
      (user) => user.id === userId,
    );
    if (!isUserAssociated)
      throw new ForbiddenException(
        `You do not have permission to share this ToDoList`,
      );

    const userToShareWith =
      await this.prisma.user.findUnique({
        where: { id: shareWithUserId },
      });
    if (!userToShareWith)
      throw new NotFoundException(
        `User with ID ${shareWithUserId} not found`,
      );

    await this.prisma.toDoList.update({
      where: { id: toDoListId },
      data: {
        users: {
          connect: { id: shareWithUserId },
        },
      },
    });

    return {
      message: `ToDoList ${toDoListId} shared with user ${shareWithUserId}`,
    };
  }
}
