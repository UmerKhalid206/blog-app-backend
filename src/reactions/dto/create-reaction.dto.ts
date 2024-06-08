import { IsEmpty, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { User } from "src/auth/schemas/user.schema";

export enum Reactions_Type {     //all of them would be of same type and they are static you can not change it in later parts
    LIKE = 'like',
    SAD = 'sad',
    No = 'no'
    // FUNNY = 'funny',
    // LOVE = 'love'
}

export class CreateReactionDto {

    @IsNotEmpty({message: 'blog_id cannont be empty'})
    @IsString({message: 'blog_id name must be a string'})
    readonly blog_id: string;


    @IsEmpty({message: 'You cannot pass userId'})                //using @IsEmpty() decorator that user must not pass this 
    readonly user: User

    @IsOptional()
    @IsEnum(Reactions_Type, {message: 'Please provide correct reaction'})    //IsEnum is a decorator that would check category field is according to the provided enum and we can also pass it an error message
    readonly reaction: Reactions_Type;

}
