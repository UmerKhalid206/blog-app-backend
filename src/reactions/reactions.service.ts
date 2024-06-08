import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { UpdateReactionDto } from './dto/update-reaction.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Reactions } from './schema/reactions.schema';
import mongoose from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';
import { Blog } from 'src/blog/schemas/blog.schema';

import { Reactions_Type } from './dto/create-reaction.dto';

@Injectable()
export class ReactionsService {

  constructor(
    @InjectModel(Reactions.name)          //InjectModel is from nestjs/schema and then pass it the name of the model
    private reactionsModel: mongoose.Model<Reactions>,
    @InjectModel(Blog.name)          //InjectModel is from nestjs/schema and then pass it the name of the model
    private blogModel: mongoose.Model<Blog>,
    ){}

    async handler(reaction_body: CreateReactionDto, user: User) {
      console.log(reaction_body, user)
      const isValidId = mongoose.isValidObjectId(reaction_body.blog_id)        //we have to check that if the id passed to this function is valid or not mongoose.isValidObjectId(id) would return us true or false
        if(!isValidId){
            throw new BadRequestException('Please enter correct blog_id')
        }
        const blog = await this.blogModel.findOne({_id:reaction_body.blog_id})
        if(!blog){
                throw new BadRequestException('Blog does not exist')   
        }

        //if a blog has no new reaction at first
        if(!blog.reactions){          
          console.log('this blog has no reactions', blog)
          if (reaction_body.reaction === 'like') {
          const res = await this.reactionsModel.create({
            blog_id: reaction_body.blog_id,
            like: user._id
            })
            console.log('res._id',res._id)
            const updated = await this.blogModel.findByIdAndUpdate(reaction_body.blog_id, { $set: { reactions: res._id } })
            return updated

          }else if(reaction_body.reaction === 'sad') {
          const res = await this.reactionsModel.create({
            blog_id: reaction_body.blog_id,
            sad: user._id
            })
            console.log('res._id',res._id)
            const updated = await this.blogModel.findByIdAndUpdate(reaction_body.blog_id, { $set: { reactions: res._id } },)
            return updated
        }
        console.log(blog)
  }

  //if a blog has some reactions 
  if (blog.reactions) {
    const reactions = await this.reactionsModel.findById(blog.reactions);
  
    if (reactions) {
      const userStringId = user._id.toString();
  
      // Remove user from previous reactions
      ['like', 'sad'].forEach((reactionType) => {
        if (reactions[reactionType].includes(userStringId)) {
          reactions[reactionType] = reactions[reactionType].filter(
            (userId) => userId.toString() !== userStringId
          );
        }
      });
  
      // Add user to new reaction type
      if (reaction_body.reaction === 'like' || reaction_body.reaction === 'sad') {
        reactions[reaction_body.reaction].push(user._id);
      }
  
      // Update the reactions
      const updatedReactions = await this.reactionsModel.findByIdAndUpdate(
        blog.reactions,
        reactions,
        { new: true }
      );
  
      return updatedReactions;
    }
  }
  
  // Handle the case where there are no reactions or the reactions model is not found
  return null;
  
    // if(blog.reactions){
    //   console.log('this blog has reactions', blog.reactions)
      
    //   const reactions = await this.reactionsModel.findOne({_id: blog.reactions})
    //   console.log(reactions)
    //   // to delete user from 
    //   if(reactions.like.includes(user._id)){
    //     console.log('yeah user like me ha ')
    //     reactions.like = reactions.like.filter(like => like.toString() !== user._id.toString())
    //     console.log(reactions)
    //   }else if(reactions.sad.includes(user._id)){
    //     console.log('yeah user sad me ha ')
    //     reactions.sad = reactions.sad.filter(sad => sad.toString() !== user._id.toString())
    //     console.log('sad', reactions)
    //   }

    //   //now add the user id into new category
    //   console.log('for new type', reactions)
    //   if (reaction_body.reaction === 'like'){
    //     reactions.like.push(user._id)
    //   }else if(reaction_body.reaction === 'sad'){
    //     reactions.sad.push(user._id)
    //   }

    //   console.log('after adding new type', reactions)
    //   const updatedReactions = await this.reactionsModel.findByIdAndUpdate(blog.reactions, reactions, {new: true})      
    //   return updatedReactions
    // }
}







  findAll() {
    return `This action returns all reactions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reaction`;
  }

  update(id: number, updateReactionDto: UpdateReactionDto) {
    return `This action updates a #${id} reaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} reaction`;
  }
}
