import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthController } from './features/auth/auth.controller';
import { UserRepository } from './features/auth/db/users.repository';
import { LoginHandler } from './features/auth/use-cases/login.command';
import { RegistrationHandler } from './features/auth/use-cases/registration.command';
import { JwtService } from './features/auth/helpers/jwt-service';
import { Comment } from './features/comments/db/comments.model';
import { Posts } from './features/posts/db/posts.model';
import { User } from './features/auth/db/users.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsRepository } from './features/posts/db/posts.repository';
import { CreatePostHandler } from './features/posts/use-cases/create.post.command';
import { GetOnePostHandler } from './features/posts/use-cases/get.one.post.command';
import { GetAllPostsHandler } from './features/posts/use-cases/get.all.posts.command';
import { PostsController } from './features/posts/posts.controller';
import { UpdateOnePostHandler } from './features/posts/use-cases/update.post.command';
import { DeleteOnePostHandler } from './features/posts/use-cases/delete.post.command';
import { CreateCommentHandler } from './features/comments/use-cases/create.comment.command';
import { GetCommentsHandler } from './features/comments/use-cases/get.many.comment.command';
import { DeleteOneCommentHandler } from './features/comments/use-cases/delete.comment.command';
import { CommentsController } from './features/comments/comments.controller';
import { CommentRepository } from './features/comments/db/comments.repository';
import { checkIsPostExist } from './features/utils/is-post-exist';
import { AdminCheck } from './features/utils/admin-check';
import { EmailManager } from './features/auth/helpers/email.manager';
import { LogoutHandler } from './features/auth/use-cases/logout.command';
import { SendRecoveryCodeHandler } from './features/auth/use-cases/send.recovery.code.command';
import { NewPasswordHandler } from './features/auth/use-cases/new.password.command';
import { TokenExpired } from './features/auth/db/token.expired.model';
import { TokenExpiredRepository } from './features/auth/db/token.repository';
import { FilesManager } from './features/files.manager';
import { AdminPagesController } from './features/admin-pages/admin-pages.controller';
import { WFFPNAAPage } from './features/admin-pages/db/wff-pnaa-pages.model';
import { Quote } from './features/admin-pages/db/quote.model';
import { UpdateQuoteHandler } from './features/admin-pages/use-cases/update-quote.command';
import { UpdateWFFPNAAHandler } from './features/admin-pages/use-cases/update-wff-pnaa.command';
import { AdminPagesRepository } from './features/admin-pages/db/admin-pages.repository';
import { GetMeHandler } from './features/auth/use-cases/get-me.command';
import { SaveSliderImageHandler } from './features/admin-pages/use-cases/create-slider-image.command';
import { SliderImage } from './features/admin-pages/db/slider-image.model';

const handlers = [
  LoginHandler,
  RegistrationHandler,
  CreatePostHandler,
  GetOnePostHandler,
  GetAllPostsHandler,
  UpdateOnePostHandler,
  DeleteOnePostHandler,
  CreateCommentHandler,
  GetCommentsHandler,
  GetCommentsHandler,
  DeleteOneCommentHandler,
  LogoutHandler,
  GetMeHandler,
  SendRecoveryCodeHandler,
  NewPasswordHandler,
  UpdateQuoteHandler,
  UpdateWFFPNAAHandler,
  SaveSliderImageHandler,
];
const repos = [
  UserRepository,
  CommentRepository,
  PostsRepository,
  TokenExpiredRepository,
  AdminPagesRepository,
  AppService,
  JwtService,
  checkIsPostExist,
  AdminCheck,
  EmailManager,
  FilesManager,
];

@Module({
  imports: [
    CqrsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('NEON_CONNECTION_STRING'),
        autoLoadEntities: true,
        synchronize: true, // ⚠️ выключи в продакшне
        ssl: {
          rejectUnauthorized: false,
        },
      }),
    }),
    TypeOrmModule.forFeature([
      User,
      Posts,
      Comment,
      TokenExpired,
      WFFPNAAPage,
      Quote,
      SliderImage,
    ]),
  ],
  controllers: [
    AuthController,
    PostsController,
    CommentsController,
    AdminPagesController,
  ],
  providers: [...handlers, ...repos],
})
export class AppModule {
  constructor() {}
}
