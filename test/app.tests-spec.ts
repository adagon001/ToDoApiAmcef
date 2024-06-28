import {
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { AuthDto } from '../src/auth/dto';
import {
  CreateToDosListDto,
  EditToDosListDto,
} from '../src/toDosList/dto';
import { PrismaService } from '../src/prisma/prisma.service';
import { EditToDoDto } from '../src/toDo/dto';
import { CreateToDoDto } from 'src/toDo/dto/create-toDo.dto';

describe('App tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef =
      await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl(
      'http://localhost:3333',
    );
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'adagon001@gmail.com',
      password: '12345678',
    };
    describe('Signup', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('should throw if no body provided', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .expectStatus(400);
      });
      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });

    describe('Signin', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('should throw if no body provided', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .expectStatus(400);
      });
      it('should signin', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'access_token');
      });
    });
  });

  describe('ToDosLists', () => {
    describe('Get empty list of toDosLists', () => {
      it('should get empty list of toDosLists', () => {
        return pactum
          .spec()
          .get('/toDosList')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectBody([]);
      });
    });

    describe('Create toDosList', () => {
      const dto: CreateToDosListDto = {
        title: 'First Bookmark',
      };
      it('should create toDosList', () => {
        return pactum
          .spec()
          .post('/toDosList')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201)
          .stores('toDosListId', 'id');
      });
    });

    describe('Get toDosLists', () => {
      it('should get 1 empty toDosList', () => {
        return pactum
          .spec()
          .get('/toDosList')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });

    describe('Get toDosList by id', () => {
      it('should get toDosList by id', () => {
        return pactum
          .spec()
          .get('/toDosList/{id}')
          .withPathParams('id', '$S{toDosListId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectJsonMatch({
            id: '$S{toDosListId}',
          });
      });
    });

    describe('Edit toDosList by id', () => {
      const dto: EditToDosListDto = {
        title: 'Nakup',
      };
      it('should edit toDosList', () => {
        return pactum
          .spec()
          .patch('/toDosList/{id}')
          .withPathParams('id', '$S{toDosListId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.title);
      });
    });

    describe('Add toDo to list', () => {
      const dto = {
        title: "Uloha 1",
        description: "Sprav Api",
        deadline: "2024-06-27T16:25:49.022Z",
      };
      it('should add toDo', () => {
        return pactum
          .spec()
          .post('/toDo')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody({
            ...dto,
            listId: '$S{toDosListId}'
          })
          .expectStatus(201)
          .expectBodyContains(dto.title)
          .stores('toDoId', 'id');
      });
    });

    describe('Edit toDosList by id', () => {
      const dto: EditToDoDto = {
        title: "Uloha 2",
        flag: "DONE",
      };
      it('should edit toDo', () => {
        return pactum
          .spec()
          .patch('/toDosList/{id}')
          .withPathParams('id', '$S{toDoId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(200)
      });
    });

    describe('Delete toDosList by id', () => {
      it('should delete toDosList', () => {
        return pactum
          .spec()
          .delete('/toDosList/{id}')
          .withPathParams('id', '$S{toDosListId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(204);
      });

      it('should get empty toDosList', () => {
        return pactum
          .spec()
          .get('/toDosList')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectJsonLength(0);
      });
    });
  });
});
