import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({                          //decorator => provide a way to modify or extend the behavior of a class, method, or property
    timestamps:true
})
export class Category {
    @Prop()            //you can pass anything of validation on this entity like required: true, unique etc in here
    name: string;

}

export const CategorySchema = SchemaFactory.createForClass(Category);           
