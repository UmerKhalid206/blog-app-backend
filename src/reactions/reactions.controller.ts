import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Put } from '@nestjs/common';
import { ReactionsService } from './reactions.service';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { UpdateReactionDto } from './dto/update-reaction.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.gaurds';
import { RolesGuard } from 'src/auth/role.gaurd';
import { Role } from 'src/auth/schemas/user.schema';
import { Roles } from 'src/auth/role.decorator';
import { Reactions } from './schema/reactions.schema';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('reactions')
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}


  @ApiBearerAuth()
  @Put()
  @UseGuards(JwtAuthGuard,RolesGuard)   //Protecting this Post route from unauthorized access using @UseGuards which are infact using AuthGuard from the @nestjs/passport package
  // @Roles(Role.User) 
  handler(
    @Body() 
    reaction_body: CreateReactionDto,
    @Req() req
    ) {
    return this.reactionsService.handler(reaction_body, req.user);
  }







  @Get()
  findAll() {
    return this.reactionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reactionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReactionDto: UpdateReactionDto) {
    return this.reactionsService.update(+id, updateReactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reactionsService.remove(+id);
  }
}
