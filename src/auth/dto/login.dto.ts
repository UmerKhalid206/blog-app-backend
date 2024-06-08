// dto means data transfer Object
//dto is the data that we are aspecting from the user and make sure user provided the correct data type
import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from "class-validator";
import { Role } from "../schemas/user.schema";


export class LoginDto{


    @IsNotEmpty()
    @IsEmail({},{message: 'Please enter correct email'})
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)                 //minimum length must be atleast 6
    readonly password: string;

    // @IsNotEmpty()
    // @IsEnum(Role, {message: 'Please enter correct role'})    //IsEnum is a decorator that would check role field is according to the provided enum and we can also pass it an error message
    // readonly role: Role;

}