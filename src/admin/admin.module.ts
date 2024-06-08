import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogSchema } from 'src/blog/schemas/blog.schema';
import { ReactionsSchema } from '../reactions/schema/reactions.schema';
import { CategorySchema } from 'src/category/schema/category.schema';
import { UserSchema } from 'src/auth/schemas/user.schema';
import { BlogService } from 'src/blog/blog.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  imports: [
    AuthModule,            //importing auth module so we can use it in our book module
    MongooseModule.forFeature([{name: 'Blog', schema: BlogSchema}]),
    MongooseModule.forFeature([{name: 'Reactions', schema: ReactionsSchema}]),
    MongooseModule.forFeature([{name: 'Category', schema: CategorySchema}]),
    MongooseModule.forFeature([{name: 'User', schema: UserSchema}]),
    CloudinaryModule
  ],
  controllers: [AdminController],
  providers: [AdminService, BlogService,CloudinaryService],
})
export class AdminModule {}
