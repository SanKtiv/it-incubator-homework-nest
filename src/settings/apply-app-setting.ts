import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { appSettings } from './app-settings'
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '../app.module';
import { useContainer } from 'class-validator';
import { ErrorsFilter } from '../infrastructure/filters/exception.filter';
import { TooManyRequestsMiddleware } from '../infrastructure/middlewares/count-requests-api.middleware';
import { RequestApiService } from '../features/requests/application/request-api.service';

// Префикс нашего приложения (http://site.com/api)
const APP_PREFIX = '/api';

// Используем данную функцию в main.ts и в e2e тестах
export const applyAppSettings = (app: INestApplication) => {
  // Для внедрения зависимостей в validator constraint
  // {fallbackOnErrors: true} требуется, поскольку Nest генерирует исключение,
  // когда DI не имеет необходимого класса.
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.use(cookieParser());
  // Применение глобальных Interceptors
  // app.useGlobalInterceptors()

  // Применение глобальных Guards
  //  app.useGlobalGuards(new AuthGuard());

  // Применить middleware глобально
  //app.use(LoggerMiddlewareFunc);
  //app.use('/auth/registration', TooManyRequestsMiddleware);
  // Cors
  app.enableCors();

  // Установка префикса
  //setAppPrefix(app);

  // Конфигурация swagger документации
  setSwagger(app);

  // Применение глобальных pipes
  setAppPipes(app);

  // Применение глобальных exceptions filters
  setAppExceptionsFilters(app);
};

// const setAppPrefix = (app: INestApplication) => {
//     // Устанавливается для разворачивания front-end и back-end на одном домене
//     // https://site.com - front-end
//     // https://site.com/api - backend-end
//     app.setGlobalPrefix(APP_PREFIX);
// };

const setSwagger = (app: INestApplication) => {
    if (!appSettings.env.isProduction()) {
        const swaggerPath = APP_PREFIX + '/swagger-doc';

        const config = new DocumentBuilder()
            .setTitle('BLOGGER API')
            .addBearerAuth()
            .addBasicAuth()
            .setVersion('1.0')
            .build();

        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup(swaggerPath, app, document, {
            customSiteTitle: 'Blogger Swagger',
        });
    }
};

const setAppPipes = (app: INestApplication) => {
  app.useGlobalPipes(
    new ValidationPipe({
      // Для работы трансформации входящих данных
      transform: true,
      // Выдавать первую ошибку для каждого поля
      stopAtFirstError: true,
      // Перехватываем ошибку, кастомизируем её и выкидываем 400 с собранными данными
      exceptionFactory: (inputErrorsArray) => {
        const resultErrorsArray = inputErrorsArray.map((e) => {
          const keysMessages = Object.keys(e.constraints as any);

          return keysMessages.map((m) => ({
            message: e.constraints?.[m],
            field: e.property,
          }));
        });

        throw new BadRequestException(resultErrorsArray.flat());
      },
    }),
  );
};

const setAppExceptionsFilters = (app: INestApplication) => {
  app.useGlobalFilters(new ErrorsFilter());
};

// const setAppMiddleware = (app: INestApplication) => {
//   app.use('/auth/registration', TooManyRequestsMiddleware)
// }
