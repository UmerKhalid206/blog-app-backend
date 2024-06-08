// dto means data transfer Object
//dto is the data that we are aspecting from the user and make sure user provided the correct data type
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength} from "class-validator";



export class emailDto{
    @IsEmail({},{message: 'Please enter correct email'})
    @IsNotEmpty()
    readonly userEmail: string;
}

export class changePasswordDto{
    @IsEmail({},{message: 'Invalid Email'})
    @IsNotEmpty({message: 'Email cannot be empty'})
    readonly userEmail: string;

    @IsNotEmpty()
    readonly password: string

}


export class updateProfileDto{


    @IsOptional()           //title field cannot be empty
    @IsString()          //it should be a string
    readonly name: string;

    @IsOptional()           //title field cannot be empty
    @IsString()          //it should be a string
    @MaxLength(350, {message: 'Profile Summary cannot be more than 350 characters'})
    readonly profileSummary: string;

    @IsOptional()
    @IsString()
    @MinLength(6)                 //minimum length must be atleast 6
    readonly password: string;

    @IsOptional()           //title field cannot be empty
    @IsString()          //it should be a string
    readonly image_url: string;

}