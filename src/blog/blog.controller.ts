import { Body, Controller, Delete, Get, Param, Post, Put,Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { BlogService } from './blog.service';
import { Blog } from './schemas/blog.schema';
import { UpdateBlogDto } from './dto/update-blog.dto';
import {Query as ExpressQuery} from 'express-serve-static-core'
import { AuthGuard } from '@nestjs/passport';
import { CreateBlogDto } from './dto/create-blog.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/auth/role.decorator';
import { Role } from 'src/auth/schemas/user.schema';
import { JwtAuthGuard } from 'src/auth/jwt-auth.gaurds';
import { RolesGuard } from 'src/auth/role.gaurd';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiBearerAuth()
@Controller('blogs')       //its the route where you can access all other methods
export class BlogController {
    constructor(private blogService: BlogService){}         //constructor would call BookService at time of rendering, which contains services of book and assigning to a private variable or whatever
    //all the decorators can use this private variable 
    @Get('all')
   
    async getAll(@Query() query: ExpressQuery): Promise<Blog[]> {
        return this.blogService.getAll(query)            //it would call the findAll() method from the BlogService and that would do find method from the database or bookModel
    }


    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    async getAllBlogs(
        @Query() query: ExpressQuery,
        @Req() req
        ): Promise<Blog[]> {
        return this.blogService.findAll(query, req.user)            //it would call the findAll() method from the BlogService and that would do find method from the database or bookModel
    }


    @Get('/writerOwnBlogs')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.writer)
    async writerOwnBlogs(
        @Query() query: ExpressQuery,
        @Req() req
        ): Promise<Blog[]> {
        return this.blogService.writerOwnBlogs(query, req.user)            //it would call the findAll() method from the BlogService and that would do find method from the database or bookModel
    }

    @Get('categorySpecific/:id')
    async categorySpecific(
        @Param('id')
        id:string
        ): Promise<Blog[]> {
        return this.blogService.categorySpecific(id)            //it would call the findAll() method from the BlogService and that would do find method from the database or bookModel
    }

    // to access this route first login and have your jwt then paste that with your post request in Authorization header => Bearer (yourToken)
    @Post('new')                        //you can access this route as localhost:3000/books/new
    @UseGuards(JwtAuthGuard,RolesGuard)   //Protecting this Post route from unauthorized access using @UseGuards which are infact using AuthGuard from the @nestjs/passport package
    @Roles(Role.writer)
    // @UseInterceptors(FileInterceptor('file'))       
    async createBlog(
        @Body()                              //@Book decorator will get us the body of the request
        blog: CreateBlogDto,         //the book that we are getting from body would be according to provided dto                                //its the destructuring of book from Body of the request
        @Req() req,          //getting the user that is logged in from request object using @Req() decorator    
        // @UploadedFile() file
        ): Promise<Blog> {        //this createBook function would behave as promise and of type Book, whereas Book is the class that have title, description etc 
       
            // let myfile: Express.Multer.File
            // if(file){
            //      myfile = file.buffer;
            //     console.log(myfile)
            // }
            // return
        return this.blogService.create(blog, req.user)           //passing the logged in user to the service function create so it can be added with the book as well
}



@Get(':id')
async getBlog(
    @Param('id')
    id:string
): Promise<Blog> {
    return this.blogService.findById(id)            
}

@Put(':id')            //you can access this route as localhost:3000/books/new
@UseGuards(JwtAuthGuard,RolesGuard)   //Protecting this Post route from unauthorized access using @UseGuards which are infact using AuthGuard from the @nestjs/passport package
@Roles(Role.writer)
@UseInterceptors(FileInterceptor('file'))
async updateBlog(
    @UploadedFile() file, 
    @Param('id')
    id:string,
    @Body()                              //@Book decorator will get us the body of the request
    blog: UpdateBlogDto,         //the book that we are getting from body would be according to provided dto                                //its the destructuring of book from Body of the request
    @Req() req
    ): Promise<Blog> {        //this createBook function would behave as promise and of type Book, whereas Book is the class that have title, description etc 
        let myfile: Express.Multer.File
        if(file){
             myfile = file.buffer;
            console.log('from update',myfile)
        }

    return this.blogService.updateById(id, blog, req.user, myfile)
}

@Delete(':id')
@UseGuards(JwtAuthGuard,RolesGuard)   //Protecting this Post route from unauthorized access using @UseGuards which are infact using AuthGuard from the @nestjs/passport package
@Roles(Role.writer, Role.Admin)
async deleteBlog(
    @Param('id')
    id:string,
    @Req() req 
): Promise<Blog> {


    return this.blogService.deleteById(id, req.user)            
}

}
