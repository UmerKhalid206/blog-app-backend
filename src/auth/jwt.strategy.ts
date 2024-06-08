import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { User } from "./schemas/user.schema";
import { Model } from "mongoose";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){      //extends a class JwtStrategy from PassportStrategy with passport-jwt strategy in it
    constructor(
        @InjectModel(User.name)            //injecting a model which is user model
        private userModel: Model<User>       //declaring a private userModel that would be of type Model imported from mongoose and using User Model
    ){   
        super({               //when we call the super in the constructor it actually calls or invokes the parent class constructor so this super will call the PassportStrategy class's constructor and pass the values to it
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),         //ExtractJwt.fromAuthHeaderAsBearerToken() is a function of the passport-jwt that would extract the token from the request's header 
            secretOrKey: process.env.JWT_SECRET
        })
    }

    //let's override our validate function
    async validate(payload){         
        const {id}  = payload                       //as we have saved the id of the user in the payload
        
        const user = await this.userModel.findById(id)      //check if the user exist or not

        if(!user){
            throw new UnauthorizedException('Login first to access this endpoint')
        }
        return user
    
    }
}

// Add this strategy in the authmodule