import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto, blogStatusDto, userStatusDto } from './dto/update-admin.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from 'src/blog/schemas/blog.schema';
import mongoose from 'mongoose';
import { Category } from 'src/category/schema/category.schema';
import { User } from 'src/auth/schemas/user.schema';
import {Query} from 'express-serve-static-core'


@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Blog.name)          //InjectModel is from nestjs/schema and then pass it the name of the model
    private blogModel: mongoose.Model<Blog>,
    @InjectModel(User.name)
    private userModel: mongoose.Model<User>
    ){}


  create(createAdminDto: CreateAdminDto) {
    return 'This action adds a new admin';
  }

  async getUsersCount(query: Query): Promise<any> {
    const { status } = query;
  
    let totalFilter = {};

  
    if (status !== undefined) {
      totalFilter = { status };
    }
  
    const totalUsersCount = await this.userModel.countDocuments(totalFilter).exec();
    const blockedUsersCount = await this.userModel.countDocuments({status: 'blocked'}).exec();
    const unblockedUsersCount = await this.userModel.countDocuments({status: 'unblocked'}).exec();
  
    return { total: totalUsersCount, blocked: blockedUsersCount, unblocked: unblockedUsersCount };
    // return blockedUsersCount
  }


  async getBlogsCount(query: Query): Promise<any> {
    const { status } = query;
  
    let totalFilter = {};

  
    if (status !== undefined) {
      totalFilter = { status };
    }
  
    const totalBlogsCount = await this.blogModel.countDocuments(totalFilter).exec();
    const approvedBlogsCount = await this.blogModel.countDocuments({status: 'approved'}).exec();
    const unApprovedBlogsCount = await this.blogModel.countDocuments({status: 'unapproved'}).exec();
  
    return { total: totalBlogsCount, approved: approvedBlogsCount, unApproved: unApprovedBlogsCount };
    // return blockedUsersCount
  }
  
  // async getUsersCount(query :Query): Promise<number> {
  //   const { status } = query;


  //   let filter = {};
  //   if (status !== undefined) {
  //     filter = { status };
  //   }
  //   const unblockedUsersTotal = await this.userModel.countDocuments(filter).exec();
  //   return unblockedUsersTotal;
  // }


  async findAllBlogs(query :Query): Promise<Blog[]> {
    console.log(query)
    // return
    const status = query.status ? {          //if keyword is there in the query then search that keyword 
            status: {
                $regex: query.status,
                $options: 'i'
            }
        }: {}
const blogs = await this.blogModel.find({...status})
    return blogs;
  }


  async findAllUsers(query :Query): Promise<User[]> {
    console.log(query)
    const status = query.status ? {          //if keyword is there in the query then search that keyword 
            status: {
                $regex: query.status,
                $options: 'i'
            }
        }: {}

        const emailFilter = {
          email:{
            $ne: 'admin@gmail.com', // Exclude user with this email address
          }
      };

const users = await this.userModel.find({...status, ...emailFilter}).select('-password')
    return users;
  }

  
  async findAll(query: any): Promise<User[]> {
    const { page, status } = query;
    const resPerPage = 4;
    const currentPage = Number(page) || 1;
    const skip = resPerPage * (currentPage - 1);
  
    let filter = {};
    if (status !== undefined) {
      filter = { status };
    }
  
    const users = await this.userModel
      .find(filter)
      // .limit(resPerPage)
      // .skip(skip)
    //   .populate({ path: 'user', select: '-password' })
  
    return users;
  }


  findOne(id: number) {
    return `This action returns a #${id} admin`;
  }

  async updateUserStatus(id: string, status: userStatusDto) {
    
    const isValidId = mongoose.isValidObjectId(id)        //we have to check that if the id passed to this function is valid or not mongoose.isValidObjectId(id) would return us true or false
        if(!isValidId){
            throw new BadRequestException('Please enter correct id')
        }

    const user = await this.userModel.findOne({_id: id})
    if(!user){
      throw new BadRequestException('user not exist')
    }
    const updatedStatus = await this.userModel.findByIdAndUpdate(id, { $set: { status: status.status } })
    
    return updatedStatus
  }


  async updateBlogStatus(id: string, status: blogStatusDto) {
    
    console.log(id, status)
    const isValidId = mongoose.isValidObjectId(id)        //we have to check that if the id passed to this function is valid or not mongoose.isValidObjectId(id) would return us true or false
        if(!isValidId){
            throw new BadRequestException('Please enter correct id')
        }

    const blog = await this.blogModel.findOne({_id: id})
    if(!blog){
      throw new BadRequestException('blog does not exist')
    }
    console.log(blog)
    const updatedStatus = await this.blogModel.findByIdAndUpdate(id, { $set: { status: status.status } })
    
    return updatedStatus
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }
}
