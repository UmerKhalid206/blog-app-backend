import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCategoryDto {
    @IsNotEmpty({message: 'category name cannont be empty'})
    @IsString({message: 'category name must be a string'})
    readonly name: string;
}
