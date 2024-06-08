import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from './schemas/blog.schema';
import mongoose, { Model } from 'mongoose';
import { Query } from 'express-serve-static-core';
import { User } from 'src/auth/schemas/user.schema';
import { Category } from 'src/category/schema/category.schema';
import { uploadToCloudinary } from 'src/cloudinary/cloudinary.provider';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';

@Injectable() //The @Injectable() decorator attaches metadata, which declares that CatsService is a class that can be managed by the Nest IoC container.
export class BlogService {
  //by default BookService is a class that is decorated by decorator Injectable
  //we have to inject our model here so that we can access our database here
  constructor(
    @InjectModel(Blog.name) //InjectModel is from nestjs/schema and then pass it the name of the model
    private blogModel: mongoose.Model<Blog>,
    @InjectModel(Category.name)
    private categoryModel: mongoose.Model<Category>,
    private cloudinaryService: CloudinaryService,
    @InjectModel(User.name)         //inject the model into this class
        private userModel : Model<User>, 
  ) {}

  // for public
  async getAll(query: Query): Promise<Blog[]> {
    console.log('query', query)
    // return 
    const resPerPage = 5
    const currentPage = Number(query.page) || 1
    const skip = resPerPage * (currentPage - 1)

    // const keyword = query.keyword ? {          //if keyword is there in the query then search that keyword
    //     title: {
    //         $regex: query.keyword,
    //         $options: 'i'
    //     }
    // }: {}



    const blogs = await this.blogModel
      .find({status: 'approved'})
      .limit(resPerPage)
      .skip(skip)
      .select('-status')
      
      .populate({ path: 'user', select:{password: 0, status:0 } })
      .populate('category')
      .populate({
        path: 'reactions',
        populate: [
          { path: 'like', model: 'User' },
          { path: 'sad', model: 'User' },
          // Add more for 'funny' and 'love' if needed
        ],
      }) 
    return blogs;
  }
// for admin
  // async findAll(query: Query): Promise<Blog[]> {
  //   console.log(query)
  //   const {page, status} = query
  //   // return 
  //   const resPerPage = 4
  //   const currentPage = Number(page) || 1
  //   const skip = resPerPage * (currentPage - 1)

  //   // const keyword = query.keyword ? {          //if keyword is there in the query then search that keyword
  //   //     title: {
  //   //         $regex: query.keyword,
  //   //         $options: 'i'
  //   //     }
  //   // }: {}
  //   const blogs = await this.blogModel.find({status: status}).limit(resPerPage).skip(skip)
  //   .populate({ path: 'user', select: '-password' })
  //     .populate('category')
  //     .populate({
  //       path: 'reactions',
  //       populate: [
  //         { path: 'like', model: 'User' },
  //         { path: 'sad', model: 'User' },
  //         // Add more for 'funny' and 'love' if needed
  //       ],
  //     }) 


  //   // const blogs = await this.blogModel
  //   //   .find({...keyword}).limit(resPerPage).skip(skip)
  //   //   .populate({ path: 'user', select: '-password' })
  //   //   .populate('category')
  //   //   .populate({
  //   //     path: 'reactions',
  //   //     populate: [
  //   //       { path: 'like', model: 'User' },
  //   //       { path: 'sad', model: 'User' },
  //   //       // Add more for 'funny' and 'love' if needed
  //   //     ],
  //   //   }) 
  //   return blogs;
  // }

  async findAll(query: Query, user: User): Promise<Blog[]> {

    const userExist = await this.userModel.findById(user.id)
    if(userExist.role !== 'admin'){
      throw new UnauthorizedException('You are not an admin')
    }
    const { page, status } = query;
    const resPerPage = 4;
    const currentPage = Number(page) || 1;
    const skip = resPerPage * (currentPage - 1);
  
    let filter = {};
    if (status !== undefined) {
      filter = { status };
    }
  
    const blogs = await this.blogModel
      .find(filter)
      // .limit(resPerPage)
      // .skip(skip)
      .populate({ path: 'user', select: '-password' })
      .populate('category')
      .populate({
        path: 'reactions',
        populate: [
          { path: 'like', model: 'User' },
          { path: 'sad', model: 'User' },
          // Add more for 'funny' and 'love' if needed
        ],
      });
  
    return blogs;
  }


  // async writerOwnBlogs(query: Query, user: User): Promise<Blog[]> {

  //   const userExist = await this.userModel.findById(user.id)
  //   if(userExist.role !== 'writer'){
  //     throw new UnauthorizedException('You are not a writer')
  //   }

  //   // const { page } = query;
  //   // const resPerPage = 4;
  //   // const currentPage = Number(page) || 1;
  //   // const skip = resPerPage * (currentPage - 1);
  
  //   // const filter: any = { user: user.id };

  //   const status = query.status ? {          //if keyword is there in the query then search that keyword 
  //     status: {
  //         $regex: query.status,
  //         $options: 'i'
  //     }
  // }: {}

  // console.log('status', status)

  //   // if (status !== undefined) {
  //   //   filter.status = status;
  //   // }

  //   // console.log('filter', filter)
  //   // return
  //   const blogs = await this.blogModel
  //     .find({_id:user.id, ...status})
  //     // .limit(resPerPage)
  //     // .skip(skip)
  //     .populate({ path: 'user', select: '-password' })
  //     .populate('category')
  //     .populate({
  //       path: 'reactions',
  //       populate: [
  //         { path: 'like', model: 'User' },
  //         { path: 'sad', model: 'User' },
  //         // Add more for 'funny' and 'love' if needed
  //       ],
  //     });
  
  //     if(!blogs.length){
  //       throw new NotFoundException('You dont have any blogs')
  //     }
  //     console.log('blogs.length', blogs.length)
  //   return blogs;
  // }

  async writerOwnBlogs(query: Query, user: User): Promise<Blog[]> {  
  
    const {status } = query;
    let filter:any = {user: user.id};
    if (status !== undefined) {
      filter.status =  status ;
    }
  
    console.log('filter', filter)
    // return
    // const blogs = await this.blogModel
    //   .find(filter)
  
  // const blogs = await this.blogModel
  //   .find({ user: user.id, ...status })
  const blogs = await this.blogModel.find(filter)
      .populate({ path: 'user', select: '-password' })
      .populate('category')
      .populate({
        path: 'reactions',
        populate: [
          { path: 'like', model: 'User' },
          { path: 'sad', model: 'User' },
          // Add more for 'funny' and 'love' if needed
        ],
      });
  
    if (!blogs.length) {
      throw new NotFoundException('You dont have any blogs');
    }
  
    console.log('blogs.length', blogs.length);
    return blogs;
  }
  
  


  async categorySpecific(id: string): Promise<Blog[]> {
    
    const blogs = await this.blogModel
      .find({category:id, status: 'approved'})
      .populate({ path: 'user', select: '-password' })
      .populate('category')
      .populate({
        path: 'reactions',
        populate: [
          { path: 'like', model: 'User' },
          { path: 'sad', model: 'User' },
          // Add more for 'funny' and 'love' if needed
        ],
      }) 
    return blogs;
  }



  async create(
    blog: Blog,
    user: User,
    // file: Express.Multer.File,
  ): Promise<Blog> {
    // const image = await this.cloudinaryService.uploadImage(file);

    console.log('blog', blog, 'user', user)

    const userExist = await this.userModel.findById(user.id)
    console.log('userExist', userExist)
    if(userExist.role !== 'writer'){
      throw new UnauthorizedException('You are not a writer')
    }
    // return
    if (user.status.toLowerCase() === 'blocked') {
      throw new UnauthorizedException('You are blocked! contact admin');
    }

    const isValidId = mongoose.isValidObjectId(blog.category); //we have to check that if the id passed to this function is valid or not mongoose.isValidObjectId(id) would return us true or false
    if (!isValidId) {
      throw new BadRequestException('Please enter correct category id');
    }

    const category = await this.categoryModel.findOne({ _id: blog.category });
    if (!category) {
      throw new BadRequestException('Invalid category');
    }

    //  user._id would give you error because User schema does not contain any field of _id to tackle that import Document from mongoose inside User schema and also extends you User schema class with Document imported from the mongoose
    const data = Object.assign(blog, {
      user: user._id,
      // images: image.secure_url,
    }); //assigning the book Object a new property user with value user._id
    console.log(data);

    const res = await this.blogModel.create(data);
    return res;
  }

  async findById(id: string): Promise<Blog> {
    //Promise<Book> means it would return a promise of type Book class

    const isValidId = mongoose.isValidObjectId(id); //we have to check that if the id passed to this function is valid or not mongoose.isValidObjectId(id) would return us true or false

    if (!isValidId) {
      throw new BadRequestException('Please enter correct id');
    }
    const blog = await this.blogModel.findById(id).populate({ path: 'user', select: '-password' })
    .populate('category')
    .populate({
      path: 'reactions',
      populate: [
        { path: 'like', model: 'User' },
        { path: 'sad', model: 'User' },
        // Add more for 'funny' and 'love' if needed
      ],
    }) ;
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }
    return blog;
  }

  async updateById(id: string, blog: Blog, user: User, file: Express.Multer.File): Promise<Blog> {
    //Promise<Book> means it would return a promise of type Book class

    // console.log('update blog', blog)
    // return
    if (user.status.toLowerCase() === 'blocked') {
      throw new UnauthorizedException('You are blocked! contact admin');
    }
    // console.log(id, blog, user)

    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Please enter correct id');
    }
    const blogData = await this.blogModel.findOne({ _id: id });
    console.log('data', blogData, 'uid', user.id);
    if (!blogData) {
      throw new NotFoundException('Blog not found');
    }

    if (user.id == blogData.user) {
      const updateFields: any = {};
      if(blog.description){
        updateFields.description =  blog.description
      }

      if(!file){
        return await this.blogModel.findByIdAndUpdate(id, {
        description: updateFields.description 
        },
         {
          new: true,
          runValidators: true,
        });
      }else{
        const image = await this.cloudinaryService.uploadImage(file)
        if(image?.secure_url){
          const updated =  await this.blogModel.findByIdAndUpdate(id, {
            description:updateFields.description,
            images: image.secure_url
          }, 
          {
            new: true,
            runValidators: true,
          });

          if(blog.images){
            await this.cloudinaryService.deleteImage(blog.images)
          }

          return updated
        }
      }
    } 
    
    else {
      throw new UnauthorizedException('You are not authorized user');
    }
  }

  async deleteById(id: string, user: User): Promise<Blog> {

    // console.log('delete',id, user)
    // return  
    //Promise<Book> means it would return a promise of type Book class

    if (user.status.toLowerCase() === 'blocked') {
      throw new UnauthorizedException('You are blocked! contact admin');
    }

    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId) {
      throw new BadRequestException('Please enter correct id');
    }

    const blogData = await this.blogModel.findOne({ _id: id });
    if (!blogData) {
      throw new NotFoundException('Blog not found');
    }

    // if(user.role === 'admin'){
    //     return await this.blogModel.findByIdAndDelete(id)
    // }

    if (user.id == blogData.user || user.role === 'admin') {
      // console.log('ids matched' )
      const res = await this.blogModel.findByIdAndDelete(id);
      return res;
    } else {
      throw new UnauthorizedException('You are not authorized user');
    }
  }
}
