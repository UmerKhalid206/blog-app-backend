/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogModule } from './blog/blog.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { ReactionsModule } from './reactions/reactions.module';
import { AdminModule } from './admin/admin.module';


@Module({
  imports: [
    ConfigModule.forRoot({        //to use your env file in your app
      envFilePath: '.env',        //its the path of the file
      isGlobal: true,           //if you want to use your .env file globally
    }),
    MongooseModule.forRoot(process.env.DB_URI),
    BlogModule,
    AuthModule,
    CategoryModule,
    ReactionsModule,
    AdminModule,
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
