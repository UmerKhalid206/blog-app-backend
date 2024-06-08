import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Roles } from 'src/auth/role.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.gaurds';
import { RolesGuard } from 'src/auth/role.gaurd';
import { Role } from 'src/auth/schemas/user.schema';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('categories')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Post('new')
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles(Role.Admin)
    
    createCategory(
    @Body() 
    category: CreateCategoryDto) {
    return this.categoryService.create(category);
  }

  @Get()
  // @UseGuards()
    findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
    findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles(Role.Admin)
  update(@Param('id') id: string, @Body() updateData: UpdateCategoryDto) {
    return this.categoryService.update(id, updateData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles(Role.Admin)
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
// }
}