import { Body, Controller, Get, Param, Patch, Post, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { Role, User } from './schemas/user.schema';
import { JwtAuthGuard } from './jwt-auth.gaurds';
import { Roles } from './role.decorator';
import {Query as ExpressQuery} from 'express-serve-static-core'
import { changePasswordDto, emailDto, updateProfileDto } from './dto/getEmail';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { RolesGuard } from './role.gaurd';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}


    @Get()
    @UseGuards(JwtAuthGuard)
async getUser(
    @Req() req
): Promise<User> {
    return this.authService.findById(req.user)            
}



    @Post('/signup')
    signUp(                     //signUp a controller function for Post method to create a user
        @Body()                  //it would access its body according to SignUpDto
        signUpDto: SignUpDto     //we would get name,email,password from the body to the SignUpDto and it would check the validations 
    ):Promise<{token: string}> {
        return this.authService.signUp(signUpDto)              //we would get name,email,password from the SignUpdto after validations to the authService's function which is signUp which would create a new user in database
    }

    @Post('/login')
    login(                     
        @Body()                  
        loginDto: LoginDto     
    ):Promise<{token: string}> {
        return this.authService.login(loginDto)              
    }


    @Post('/generateOtp')
    generateOtp(                     
        @Body()                  
        body: emailDto,
            
    ){
        return this.authService.generateOtp(body)              
    }

    @Patch('/verifyOtp')
    verifyOtp(                     
        @Query() query: ExpressQuery,
        @Body()                  
        body: emailDto,
    ):Promise<any> {
    //    console.log('res.locals.otpData', res.locals.otpData) 
        return this.authService.verifyOtp(query, body)              
    }


    @Patch('/changePassword')
    changePassword(                     
        @Query() query: ExpressQuery,
        @Body()                  
        body: changePasswordDto,
    ):Promise<any> {
    //    console.log('res.locals.otpData', res.locals.otpData) 
        return this.authService.changePassword(query, body)              
    }


    @Patch('/updateProfile')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file'))
   async updateProfile(
    @UploadedFile() file,                     
        @Body()                  
        body: updateProfileDto,
        @Req() req,  
    ):Promise<any> {

        let myfile: Express.Multer.File
            if(file){
                 myfile = file.buffer;
                console.log('from update',myfile)
            }
    //    console.log('res.locals.otpData', res.locals.otpData) 
        return this.authService.updateProfile(req.user, body, myfile)              
    }






}
