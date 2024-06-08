import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { RolesGuard } from './role.gaurd';
import { OtpSchema } from './schemas/otp.schema';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  imports: [
    PassportModule.register({defaultStrategy: 'jwt'}),        //from @nestjs/passport package
    JwtModule.registerAsync({                                  //from @nestjs/jwt package  //we can use simple .register but we would be using config variable inside here that's why using registerAsync  
    inject: [ConfigService],                              //it would access our env variables here otherwise its undefined 
    useFactory: (config: ConfigService) => {               //function to generate jwt
      return{
        secret: config.get<string>('JWT_SECRET'),             //we would get secret from env through config.get('JWT_SECRET')
        signOptions: {
          expiresIn: config.get<string>('JWT_EXPIRES'),
        }
      }
    }
  
  }),
      MongooseModule.forFeature([{name: 'User', schema: UserSchema}]),
      MongooseModule.forFeature([{name: 'Otp', schema: OtpSchema}]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RolesGuard, CloudinaryService],            //the operations that auth module is providing
  exports: [JwtStrategy, PassportModule]              //all the modules that i want to use in other modules and in book module i have to protect my routes that's why i am exporting these modules
})
export class AuthModule {}
