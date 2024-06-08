import { PartialType } from '@nestjs/swagger';
import { CreateAdminDto } from './create-admin.dto';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { blogStatuses, userStatuses } from '../entities/admin.entity';

export class UpdateAdminDto extends PartialType(CreateAdminDto) {}


export class userStatusDto{
    @IsNotEmpty()           //title field cannot be empty
    @IsEnum(userStatuses, {message: 'Please enter correct status'}) 
    readonly status: string;
}

export class blogStatusDto{
    @IsNotEmpty()           //title field cannot be empty
    @IsEnum(blogStatuses, {message: 'Please enter correct status'}) 
    readonly status: string;
}