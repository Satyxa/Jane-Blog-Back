import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from '../../app.module';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { JwtService } from '../auth/helpers/jwt-service';
import { ErrorType, HttpExceptionFilter } from '../../exception.filter';
import { UserRepository } from '../auth/db/users.repository';
import * as path from 'path';
import { OnePostViewModel } from '../posts/db/posts.model';
import { CommentViewModel } from '../comments/db/comments.model';

const pathes = {
  registration: '/auth/registration',
  login: '/auth/login',
  logout: '/auth/logout',
  posts: '/posts/',
  comments: '/comments/',
};

describe('Testing app', () => {
  let app: INestApplication;

  let userRepository: UserRepository;

  let userId = '';

  let recoveryCode = '';
  const adminEmail = 'satyxa1919@gmail.com';
  const adminPasswordOld = 'riba-balon';
  const adminPasswordNew = 'napukanni.kamenj.tuhlyi';
  let accessTokenExpired = '';
  let accessToken = '';

  let post: OnePostViewModel | null = null;
  let postForDelete: OnePostViewModel | null = null;
  let commentForDelete: CommentViewModel | null = null;

  const postTitle = 'Test Post Title';
  const postText = 'This is the post content.';
  const postNewTitle = 'NEEEW TITLE';
  const postNewText = 'NEEEW TEXT';

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [JwtService, ConfigService],
    }).compile();

    app = module.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        exceptionFactory: (errors) => {
          const errorsForRes: ErrorType[] = [];
          errors.forEach((e) => {
            const zeroKey = Object.keys(e.constraints!)[0];
            errorsForRes.push({
              field: e.property,
              message: e.constraints![zeroKey],
            });
          });
          throw new BadRequestException(errorsForRes);
        },
      }),
    );

    app.useGlobalFilters(new HttpExceptionFilter());

    await app.init();

    userRepository = module.get<UserRepository>(UserRepository);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Registration and login for admin', () => {
    it('/Registration', async () => {
      const response = await request(app.getHttpServer())
        .post(pathes.registration)
        .send({ email: adminEmail, password: adminPasswordOld })
        .expect(200);

      expect(response.body).toEqual({
        email: adminEmail,
        id: expect.any(String),
        posts: [],
      });

      userId = response.body.id;
    });

    it('/Registration with not admin email', async () => {
      const response = await request(app.getHttpServer())
        .post(pathes.registration)
        .send({ email: 'satyan20003@gmail.com', password: 'riba-balon' })
        .expect(400);
      expect(response.body).toEqual({
        errorsMessages: [
          { field: 'email', message: 'Only admin can create an account' },
        ],
      });
    });

    it('/Login', async () => {
      const response = await request(app.getHttpServer())
        .post(pathes.login)
        .send({ email: adminEmail, password: adminPasswordOld })
        .expect(200);

      expect(response.body).toEqual({ accessToken: expect.any(String) });
      accessTokenExpired = response.body.accessToken;
    });

    it('/Send recovery code', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/recovery-code')
        .send({ email: adminEmail })
        .expect(204);

      const user = await userRepository.getUserByEmail(adminEmail); // или mock / memory store
      expect(user).toBeDefined();
      expect(user!.recoveryCode).toBeDefined();

      recoveryCode = user!.recoveryCode!; // сохрани код для следующего шага
    });

    it('/Change password with recovery code', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/new-password')
        .send({
          email: adminEmail,
          recoveryCode,
          newPassword: adminPasswordNew,
        })
        .expect(204);
    });

    it('/Logout', async () => {
      const response = await request(app.getHttpServer())
        .post(pathes.logout)
        .send({ token: accessTokenExpired })
        .expect(204);
    });

    it('/Login', async () => {
      const response = await request(app.getHttpServer())
        .post(pathes.login)
        .send({ email: adminEmail, password: adminPasswordNew })
        .expect(200);

      expect(response.body).toEqual({ accessToken: expect.any(String) });
      accessToken = response.body.accessToken;
    });
  });

  describe('Create posts, read, update and delete', () => {
    it('Create a post with expired token', async () => {
      const response = await request(app.getHttpServer())
        .post(pathes.posts)
        .set('Authorization', `Bearer ${accessTokenExpired}`)
        .send({ title: postTitle, text: postText })
        .expect(400);

      expect(response.body).toEqual({
        errorsMessages: [{ field: 'token', message: 'Token expires' }],
      });
    });

    it('Create a post with image', async () => {
      const imagePath = path.join(__dirname, 'images/test-image.png');
      const response = await request(app.getHttpServer())
        .post(pathes.posts)
        .set('Authorization', `Bearer ${accessToken}`)
        .field('title', postTitle)
        .field('text', postText)
        .attach('file', imagePath)
        .expect(200);

      expect(response.body).toEqual({
        id: expect.any(String),
        userId: expect.any(String),
        title: 'Test Post Title',
        text: 'This is the post content.',
        imageUrl: expect.stringMatching(
          /^https:\/\/storage\.googleapis\.com\/.+\.png$/,
        ),
        createdAt: expect.any(String),
        comments: [],
      });

      post = response.body;

      const secondResponse = await request(app.getHttpServer())
        .post(pathes.posts)
        .set('Authorization', `Bearer ${accessToken}`)
        .field('title', postTitle)
        .field('text', postText)
        .attach('file', imagePath)
        .expect(200);

      postForDelete = secondResponse.body;
    });

    it('Update a post', async () => {
      await request(app.getHttpServer())
        .put(`${pathes.posts}${post!.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .field('title', postNewTitle)
        .field('text', postNewText)
        .expect(204);
    });

    it('Get the post with updated title and text', async () => {
      const response = await request(app.getHttpServer())
        .get(`${pathes.posts}${post!.id}`)
        .expect(200);

      expect(response.body).toMatchObject(
        expect.objectContaining({
          id: post!.id,
          title: postNewTitle,
          text: postNewText,
          imageUrl: post!.imageUrl,
        }),
      );
    });

    it('Update a post image', async () => {
      const imagePath = path.join(__dirname, 'images/image-for-update.jpeg');
      await request(app.getHttpServer())
        .put(`${pathes.posts}${post!.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .attach('file', imagePath)
        .expect(204);
    });

    it('Get the post with updated image', async () => {
      const response = await request(app.getHttpServer())
        .get(`${pathes.posts}${post!.id}`)
        .expect(200);

      expect(response.body.imageUrl).toMatch(
        /^https:\/\/storage\.googleapis\.com\/.+\.(jpg|jpeg|png)$/i,
      );
      expect(response.body.imageUrl).not.toEqual(post!.imageUrl),
        expect(response.body).toMatchObject(
          expect.objectContaining({
            id: post!.id,
            title: postNewTitle,
            text: postNewText,
          }),
        );
    });

    it('Delete the post', async () => {
      await request(app.getHttpServer())
        .delete(`${pathes.posts}${postForDelete!.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(204);
    });

    it('Get the deleted post', async () => {
      const response = await request(app.getHttpServer())
        .get(`${pathes.posts}${postForDelete!.id}`)
        .expect(400);
    });
  });

  describe('Create comments, read and delete', () => {
    it('Create comment', async () => {
      const response = await request(app.getHttpServer())
        .post(`${pathes.comments}${post!.id}`)
        .send({ text: 'aboba', username: 'satyxa' })
        .expect(200);

      expect(response.body).toEqual({
        id: expect.any(String),
        postId: post!.id,
        text: 'aboba',
        username: 'satyxa',
        createdAt: expect.any(String),
      });
      await request(app.getHttpServer())
        .post(`${pathes.comments}${post!.id}`)
        .send({ text: '4ypka', username: 'satyxa' })
        .expect(200);

      await request(app.getHttpServer())
        .post(`${pathes.comments}${post!.id}`)
        .send({ text: 'riba-balon', username: 'Andrey' })
        .expect(200);

      commentForDelete = response.body;
    });

    it('Create comment reply', async () => {
      const response = await request(app.getHttpServer())
        .post(`${pathes.comments}${post!.id}`)
        .send({
          text: 'soska-nerealka',
          username: '4el',
          replyToId: commentForDelete!.id,
        })
        .expect(200);

      expect(response.body).toEqual({
        id: expect.any(String),
        postId: post!.id,
        text: 'soska-nerealka',
        username: '4el',
        createdAt: expect.any(String),
      });
    });

    it('Get comments', async () => {
      const response = await request(app.getHttpServer())
        .get(`${pathes.posts}${post!.id}`)
        .expect(200);
      expect(response.body.comments).toMatchObject(
        expect.arrayContaining([
          {
            id: expect.any(String),
            postId: post!.id,
            text: 'aboba',
            username: 'satyxa',
            createdAt: expect.any(String),
            replies: [
              {
                id: expect.any(String),
                postId: null,
                text: 'soska-nerealka',
                username: '4el',
                createdAt: expect.any(String),
              },
            ],
          },
          {
            id: expect.any(String),
            postId: post!.id,
            text: '4ypka',
            username: 'satyxa',
            createdAt: expect.any(String),
            replies: [],
          },
          {
            id: expect.any(String),
            postId: post!.id,
            text: 'riba-balon',
            username: 'Andrey',
            createdAt: expect.any(String),
            replies: [],
          },
        ]),
      );
    });

    it('Delete comment', async () => {
      const response = await request(app.getHttpServer())
        .delete(`${pathes.comments}${commentForDelete!.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(204);
    });

    it('Get comments', async () => {
      const response = await request(app.getHttpServer())
        .get(`${pathes.comments}${post!.id}`)
        .expect(200);

      const comments = response.body;

      expect(Array.isArray(comments)).toBe(true);

      const ids = comments.map((c: any) => c.id);
      expect(ids).not.toContain(commentForDelete!.id);
    });
  });

  // describe('Delete all', () => {
  //   it('Delete user and everything tied', async () => {
  //     await userRepository.deleteUser(userId);
  //
  //     const user = await userRepository.getUserById(userId);
  //     expect(user).toBeNull();
  //   });
  // });
});
