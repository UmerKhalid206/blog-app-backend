import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs'
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { changePasswordDto, emailDto, updateProfileDto } from './dto/getEmail';
import { Response } from 'express';
import { Query } from 'express-serve-static-core';
import * as nodemailer from 'nodemailer';
import Mailgen from 'mailgen';
import { Otp } from './schemas/otp.schema';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';


@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)         //inject the model into this class
        private userModel : Model<User>,       //make a private userModel that would be of type User
        @InjectModel(Otp.name)         //inject the model into this class
        private optModel : Model<Otp>,       //make a private userModel that would be of type User
        private jwtService: JwtService,         //a private variable jwtService that would be of type JwtService which is imported from @nestjs/jwt   
        private cloudinaryService: CloudinaryService        
        ){}


    async findById(user: User): Promise<User>{
        return await this.userModel.findById({_id: user.id}).select('-password')
    }



    async signUp(signUpDto: SignUpDto) : Promise<{token: string}>{      //this function would return a promise and inside that promise we would have our token that would be of string type
        const {name, email, password, role} = signUpDto

        const checkMail = await this.userModel.findOne({email: email})
        if(checkMail){
            throw new BadRequestException('Email already exists')
        }
        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await this.userModel.create({
            name,
            email,
            role,
            password: hashedPassword
        })

        const token = this.jwtService.sign({id: user._id, role: user.role})        //generating a token =>  this.jwtService.sign({id: user._id})  would generate a token and {id: user._id} is the payload which is userId that would be encoded in the generated token
        return {token}
    }

    async login(loginDto: LoginDto) : Promise<{token: string}>{
        console.log('data front',loginDto)
        const {email, password} = loginDto;

        const user = await this.userModel.findOne({email})       //check if this email exist or not?
        if(!user){          //if user not exist
            throw new UnauthorizedException('Invalid credentials')
        }
        // if(role !== user.role){
        //     throw new UnauthorizedException('Invalid credentials')
        // }

        const isPaaswordMatched = await bcrypt.compare(password, user.password)

        if(!isPaaswordMatched){          //if password not matched
            throw new UnauthorizedException('Invalid credentials')
        }
        // if email and password is correct assign token
        const token = this.jwtService.sign({id: user._id, role:user.role})        
        return {token}

    }



 

    // async generateOtp(body: any, res: Response): Promise<any> {
    //     const { userEmail } = body;
    //     const user = await this.userModel.findOne({ email: userEmail });
    //     if (!user) {
    //       console.log(user);
    //       throw new UnauthorizedException('Invalid Email');
    //     }

    //     const otpExist = await this.optModel.find({email: user.email})
    //     console.log('otpExist', otpExist)
    
    //     const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    //     console.log(user, 'generated otp', otpCode);
    
    //     const transporter = nodemailer.createTransport({
    //       service: 'gmail',
    //       auth: {
    //         user: process.env.EMAIL,
    //         pass: process.env.PASSWORD,
    //       },
    //     });
    
    //     const htmlContent = `
    //       <html>
    //         <head>
    //           <title>Otp verifier</title>
    //         </head>
    //         <body>
    //           <p>Hello ${user.name},</p>
    //           <p>Your OTP code is: ${otpCode}</p>
    //           <p>This is from nuntium</p>
    //           <p>Please ignore this email if you did not request to log in.</p>
    //         </body>
    //       </html>
    //     `;
    
    //     const message = {
    //       from: process.env.EMAIL,
    //       to: user.email,
    //       subject: 'Otp verifier',
    //       html: htmlContent,
    //     };
    
    //     const mailResponse = await transporter.sendMail(message)
    //     console.log('mailResponse', mailResponse)
    //     if(mailResponse.accepted){
    //         if(!otpExist.length){
    //             const otp = await this.optModel.create({
    //                 email: user.email,
    //                 code: otpCode
    //             })
    //             console.log("otp in db", otp)
    //             return otp
    //         }
    //         else{
    //             const updateOtp = await this.optModel.findOneAndUpdate(
    //                 { email: userEmail },
    //                 { $set: { code: otpCode, expiresAt: new Date(Date.now() + 5 * 60 * 1000) } },
    //                 { new: true } // Return the updated document
    //               );
    //               console.log('updated otp', updateOtp)
    //             return updateOtp
    //         }
    //     }

    //   }

    async generateOtp(body: emailDto): Promise<any> {
        const { userEmail } = body;
        console.log('front', userEmail)
        const user = await this.userModel.findOne({ email: userEmail });
        if (!user) {
          throw new BadRequestException('Email does not exist');
        }
      
        const otpExist = await this.optModel.findOne({ email: user.email });
      
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
          },
        });
      
        const htmlContent = `
          <html>
            <head>
              <title>Otp verifier</title>
            </head>
            <body>
              <p>Hello ${user.name},</p>
              <p>Your OTP code is: ${otpCode}</p>
              <p>This is from nuntium</p>
              <p>Please ignore this email if you did not request to log in.</p>
            </body>
          </html>
        `;
      
        const message = {
          from: process.env.EMAIL,
          to: user.email,
          subject: 'Otp verifier',
          html: htmlContent,
        };
      
        const mailResponse = await transporter.sendMail(message);
        console.log('mailResponse', mailResponse);
      
        let otpResponse;
      
        if (mailResponse.accepted.includes(user.email)) {
          if (!otpExist) {
            const otp = await this.optModel.create({
              email: user.email,
              code: otpCode,
            });
            console.log("otp in db", otp);
            otpResponse = { message: 'OTP generated successfully', otpCode, status: 200 };
            // return otpCode
          } else {
            const updateOtp = await this.optModel.findOneAndUpdate(
              { email: user.email },
              { $set: { code: otpCode, expiresAt: new Date(Date.now() + 5 * 60 * 1000) } },
              { new: true } // Return the updated document
            );
            console.log('updated otp', updateOtp);
            otpResponse = { message: 'OTP updated successfully', otpCode, status: 200 };
            // return updateOtp.code
          }
        } else {
          otpResponse = { message: 'Failed to send OTP', otpCode: null, status: 401 };
        }
      
        return otpResponse;
      }
      



    async verifyOtp(query: Query, body: emailDto) : Promise<any>{
        console.log('verifyOtp query',query)
        console.log('verifyOtp body',body)

        const otp:any = await this.optModel.findOne({ email: body.userEmail , code: query.code , expiresAt: { $gt: new Date() } });
        console.log('verfified otp', otp)
        if (otp) {
    //   await this.optModel.findOneAndDelete({email: body.userEmail , code: query.code})
      return {matched: true};
    }else{
        throw new BadRequestException('Invalid Otp')
    }
    //     return query
    }



    async changePassword(query: Query, body: changePasswordDto) : Promise<any>{

        console.log('verifyOtp query',query)
        console.log('verifyOtp body',body)

        // return
        const otp:any = await this.optModel.findOne({ email: body.userEmail , code: query.code , expiresAt: { $gt: new Date() } });
        console.log('verfified otp', otp)
        if (otp) {
          const hashedPassword = await bcrypt.hash(body.password, 10)
    const res = await this.userModel.findOneAndUpdate({email: body.userEmail}, { password: hashedPassword }, { new: true }).exec();  
    return res;
    }else{
        throw new BadRequestException('Invalid Otp/Expired')
    }
  }


  async updateProfile(user: User, body: updateProfileDto, file: Express.Multer.File) : Promise<any>{
    
    // console.log('body', body)
    // return
    const updateFields: any = {};
    if (body.name) {
      updateFields.name = body.name;
  }

    if (body.profileSummary) {
      updateFields.profileSummary = body.profileSummary;
  }

  if (body.password) {
      const hashedPassword = await bcrypt.hash(body.password, 10);
      updateFields.password = hashedPassword;
  }

    if(!file){
      return await this.userModel.findByIdAndUpdate(user._id, {
        name: updateFields.name,
        profileSummary: updateFields.profileSummary,
        password: updateFields.password,
      }, 
      {
        new: true,
        runValidators: true,
    })
    }
    else{
      const image = await this.cloudinaryService.uploadImage(file)
      if(image?.secure_url){
        const updated = await this.userModel.findByIdAndUpdate(user._id, {
          name: updateFields.name,
          profileSummary: updateFields.profileSummary,
          password: updateFields.password,
          image_url: image.secure_url
        }, 
        {
          new: true,
          runValidators: true,
      })

      if(body.image_url){
        await this.cloudinaryService.deleteImage(body.image_url)
      }
      return updated
      }
      else{
        throw new ConflictException('could not update')
      }

    }

}


}