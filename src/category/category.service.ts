import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schema/category.schema';
import mongoose from 'mongoose';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)          //InjectModel is from nestjs/schema and then pass it the name of the model
    private categoryModel: mongoose.Model<Category>
    ){}



  async create(category: Category) {
    let {name} = category
    name = name.toLowerCase()
    const exist = await this.categoryModel.findOne({name})
    
      if(exist){
        throw new BadRequestException('Category already exists')
    }
    else{
      const res = await this.categoryModel.create({name:name})
      return res;
    }
  }

  async findAll() {
    // return await this.categoryModel.aggregate([{ $sample: { size: 50 } }]);
    return await this.categoryModel.find();
  }

  async findOne(id: string) {
    const res = await this.categoryModel.findOne({_id: id})
    return res
  }

  async update(id: string, updateData: Category) {
    let {name} = updateData
    name = name.toLowerCase()
    return await this.categoryModel.findByIdAndUpdate(id, {name}, {
      new: true,
      runValidators: true,
  })
  }

  async remove(id: string) {
    const res = await this.categoryModel.findByIdAndDelete({_id: id})
    return res
  }
}
