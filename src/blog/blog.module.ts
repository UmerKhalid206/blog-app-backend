import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogSchema } from './schemas/blog.schema';
import { AuthModule } from 'src/auth/auth.module';
import { CategorySchema } from 'src/category/schema/category.schema';
// import { ReactionsSchema } from 'src/reactions/schema/Reactions.schema';
import { ReactionsSchema } from '../reactions/schema/reactions.schema';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UserSchema } from 'src/auth/schemas/user.schema';


// book.module.ts is like a main file of the book module it will gather all other things like servie file controller file etc
@Module({
  imports: [
    AuthModule,            //importing auth module so we can use it in our book module
    MongooseModule.forFeature([{name: 'Blog', schema: BlogSchema}]),
    MongooseModule.forFeature([{name: 'Reactions', schema: ReactionsSchema}]),
    MongooseModule.forFeature([{name: 'Category', schema: CategorySchema}]),
    MongooseModule.forFeature([{name: 'User', schema: UserSchema}]),
    CloudinaryModule
  ],
  controllers: [BlogController],
  providers: [BlogService, CloudinaryService]
})
export class BlogModule {}
