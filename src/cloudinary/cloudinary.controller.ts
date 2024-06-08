import { Body, Controller, Delete, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.gaurds';
// import { Roles } from 'src/auth/role.decorator';
import { RolesGuard } from 'src/auth/role.gaurd';
// import { Role } from 'src/auth/schemas/user.schema';
import { CloudinaryService } from './cloudinary.service';
// import { IsNotEmpty } from 'class-validator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { deleteImageDto } from './dto/delete-image.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('cloudinary')
export class  CloudinaryController {
    constructor(private cloudinaryService: CloudinaryService) {}
    @Post('newImage')
   
    @UseGuards(JwtAuthGuard,RolesGuard)
    // @Roles(Role.Admin)
    // @Use
    @UseInterceptors(FileInterceptor('file'))
    async uploadToCloud(@UploadedFile() file): Promise<any> {

      let myfile: Express.Multer.File
            if(file){
                 myfile = file.buffer;
                console.log('from blog app',myfile)
            }else{
              return
            }
            // return
    return this.cloudinaryService.uploadImage(myfile);
  }

  @ApiBearerAuth()
  @Delete()
  @UseGuards(JwtAuthGuard,RolesGuard)   //Protecting this Post route from unauthorized access using @UseGuards which are infact using AuthGuard from the @nestjs/passport package
  // @Roles(Role.writer, Role.Admin)
  async deleteImage(
    @Body()
      body: deleteImageDto,
  ): Promise<any> {
    const {image_url} = body
      return this.cloudinaryService.deleteImage(image_url)            
  }
}
