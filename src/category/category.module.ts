import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CategorySchema } from './schema/category.schema';

@Module({
  imports: [
    AuthModule,            //importing auth module so we can use it in our book module
    MongooseModule.forFeature([{name: 'Category', schema: CategorySchema}])],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [MongooseModule.forFeature([{name: 'Category', schema: CategorySchema}])]
})
export class CategoryModule {}
