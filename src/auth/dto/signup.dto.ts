// dto means data transfer Object
//dto is the data that we are aspecting from the user and make sure user provided the correct data type

import { IsEmail, IsEmpty, IsEnum, IsNotEmpty, IsString, MinLength } from "class-validator";


import { Role } from "../schemas/user.schema";

export enum approvedRoles {     //all of them would be of same type and they are static you can not change it in later parts
    User = 'user',
    writer = 'writer'
}

export class SignUpDto{

    @IsNotEmpty()           //title field cannot be empty
    @IsString()          //it should be a string
    readonly name: string;

    @IsNotEmpty()
    @IsEmail({},{message: 'Please enter correct email'})
    readonly email: string;


    @IsEnum(approvedRoles, {message: 'Please enter correct role'})    //IsEnum is a decorator that would check role field is according to the provided enum and we can also pass it an error message
    // @IsNotEmpty()
    readonly role: Role;

    @IsEmpty({message: 'you cannot enter status'})
    readonly status: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)                 //minimum length must be atleast 6
    readonly password: string;


}