// dto means data transfer Object
//dto is the data that we are aspecting from the user and make sure user provided the correct data type
import {IsEmpty, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Category } from "src/category/schema/category.schema";
import { User } from "src/auth/schemas/user.schema";
import { Reactions } from "src/reactions/schema/reactions.schema";

export class CreateBlogDto{

    @IsNotEmpty()           //title field cannot be empty
    @IsString()          //it should be a string
    readonly title: string;

    @IsNotEmpty()
    @IsString()
    readonly description: string;


    @IsNotEmpty()
    @IsString()
    readonly images: string

    @IsEmpty({message: 'you cannot pass anything to status field'})
    readonly status: string

    @IsEmpty({message: 'You cannot pass reaction at creation time'})
    readonly reactions: Reactions

    @IsNotEmpty()
    @IsString()    
    readonly category: Category;

    @IsEmpty({message: 'You cannot pass userId'})                //using @IsEmpty() decorator that user must not pass this 
    readonly user: User            //user cannot pass User in the body because for book it would be fetched automatically from the request object

}