import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';  
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { NextFunction } from 'express';

async function bootstrap() {
  // pipes can be used globally as here or on every route
  // to use these pipes we have to use two packages class-validator and one is class-transformer
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {cors: true});
  app.useBodyParser('json');
  // app.useBodyParser('json', { limit: '5mb' });

  // const corsOptions: CorsOptions = {
  //   origin: 'http://localhost:3000', // Replace with your frontend URL
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  //   credentials: true,
  // };
  // app.enableCors(corsOptions);

  // app.enableCors()
  app.enableCors({
    // origin: 'http://localhost:3000',   //origin: true, => true for all origins
    origin: '*',
    // methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    // allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'Authorization'],
    // allowedHeaders: '*',
    // allowedHeaders: 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe',
    // credentials: true,
    optionsSuccessStatus: 204,
  });

  // app.use(function (request: Request, response: Response, next: NextFunction) {
  //   response.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  //   next();
  // });

  app.enableCors

  const config = new DocumentBuilder().addBearerAuth()
    .setTitle('Blog App')
    .setDescription('')
    .setVersion('1.0')
    .addTag('swag')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
    ],
    customCssUrl: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.css',
    ],
  });
  
  app.useGlobalPipes(new ValidationPipe())        //now we can use validation pipe globally to validate our inputs
  await app.listen(3002);
}
bootstrap();
