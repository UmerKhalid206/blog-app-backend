// dto means data transfer Object
//dto is the data that we are aspecting from the user and make sure user provided the correct data type
import {IsEmpty, IsOptional, IsString } from "class-validator";
import { Category } from "src/category/schema/category.schema";
import { User } from "src/auth/schemas/user.schema";
import { Reactions } from "src/reactions/schema/reactions.schema";

export class UpdateBlogDto{

    @IsEmpty({message: 'You cannot change title'})        //it should be a string
    readonly title: string;

    @IsOptional()
    @IsString()
    readonly description: string;

    @IsOptional()
    @IsString()
    readonly images: string

    @IsEmpty({message: 'you cannot pass anything to status field'})
    readonly status: string

    @IsEmpty({message: 'You cannot pass reaction at blog updation time'})
    readonly reactions: Reactions

    @IsOptional()
    @IsString()    //IsEnum is a decorator that would check category field is according to the provided enum and we can also pass it an error message
    readonly category: Category;

    @IsEmpty({message: 'You cannot pass userId'})                //using @IsEmpty() decorator that user must not pass this 
    readonly user: User           //user cannot pass User in the body because for book it would be fetched automatically from the request object

}