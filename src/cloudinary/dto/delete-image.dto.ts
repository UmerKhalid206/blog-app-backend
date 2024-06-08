import {IsNotEmpty, IsString } from "class-validator";


export class deleteImageDto{

    @IsNotEmpty()           
    @IsString()          
    readonly image_url: string;

}