import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto, blogStatusDto, userStatusDto } from './dto/update-admin.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.gaurds';
import { RolesGuard } from 'src/auth/role.gaurd';
import { Roles } from 'src/auth/role.decorator';
import { Role, User } from 'src/auth/schemas/user.schema';
import {Query as ExpressQuery} from 'express-serve-static-core'
import { Blog } from 'src/blog/schemas/blog.schema';
import { BlogService } from 'src/blog/blog.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService,
    private blogService: BlogService
    ) {}

  @Post()
  @UseGuards(JwtAuthGuard,RolesGuard)   //Protecting this Post route from unauthorized access using @UseGuards which are infact using AuthGuard from the @nestjs/passport package
  @Roles(Role.Admin)
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  @Get('/blogs')
  @UseGuards(JwtAuthGuard,RolesGuard)   //Protecting this Post route from unauthorized access using @UseGuards which are infact using AuthGuard from the @nestjs/passport package
  @Roles(Role.Admin)
  async getBlogs(@Query() query: ExpressQuery): Promise<Blog[]> {
    return this.adminService.findAllBlogs(query)            //it would call the findAll() method from the BlogService and that would do find method from the database or bookModel
}

  @Get('/users')
  @UseGuards(JwtAuthGuard,RolesGuard)   //Protecting this Post route from unauthorized access using @UseGuards which are infact using AuthGuard from the @nestjs/passport package
  @Roles(Role.Admin)
  async getUsers(@Query() query: ExpressQuery): Promise<User[]> {
    return this.adminService.findAllUsers(query)            //it would call the findAll() method from the BlogService and that would do find method from the database or bookModel
}

@Get('/all')
@UseGuards(JwtAuthGuard)
@Roles(Role.Admin)
async getAllUser(@Query() query: ExpressQuery): Promise<User[]> {
return this.adminService.findAll(query)            
}

@Get('/userCount')
@UseGuards(JwtAuthGuard)
@Roles(Role.Admin)
async getUserCount(@Query() query: ExpressQuery): Promise<any> {
return this.adminService.getUsersCount(query)            
}


@Get('/blogCount')
@UseGuards(JwtAuthGuard)
@Roles(Role.Admin)
async getBlogCount(@Query() query: ExpressQuery): Promise<any> {
return this.adminService.getBlogsCount(query)            
}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(+id);
  }

  @Patch('/userStatus/:id')
  @UseGuards(JwtAuthGuard,RolesGuard)   
  @Roles(Role.Admin)
  updateUserStatus(
    @Param('id') 
    id: string, 
    @Body() status: userStatusDto) {
    return this.adminService.updateUserStatus(id, status);
  }

  @Patch('/blogStatus/:id')
  @UseGuards(JwtAuthGuard,RolesGuard)   //Protecting this Post route from unauthorized access using @UseGuards which are infact using AuthGuard from the @nestjs/passport package
  @Roles(Role.Admin)
  updateBlogStatus(
    @Param('id') 
    id: string, 
    @Body() status: blogStatusDto) {
      console.log('from front status',status)
    return this.adminService.updateBlogStatus(id, status);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.remove(+id);
  }
}
