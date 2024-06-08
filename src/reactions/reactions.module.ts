import { Module } from '@nestjs/common';
import { ReactionsService } from './reactions.service';
import { ReactionsController } from './reactions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ReactionsSchema } from './schema/reactions.schema';
import { AuthModule } from 'src/auth/auth.module';
import { BlogSchema } from 'src/blog/schemas/blog.schema';

@Module({
  imports: [AuthModule,
    MongooseModule.forFeature([{name: 'Blog', schema: BlogSchema}]),
    MongooseModule.forFeature([{name: 'Reactions', schema: ReactionsSchema}])],
  controllers: [ReactionsController],
  providers: [ReactionsService],
})
export class ReactionsModule {}
