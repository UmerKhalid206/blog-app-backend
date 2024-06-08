import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { User } from "src/auth/schemas/user.schema";
import { Category } from "src/category/schema/category.schema";
import { Reactions } from "src/reactions/schema/reactions.schema";

@Schema({                          //decorator => provide a way to modify or extend the behavior of a class, method, or property
    timestamps:true
})
// to create a schema we have to create a class
export class Blog {
    @Prop()            //you can pass anything of validation on this entity like required: true, unique etc in here
    title: string;

    @Prop()            
    description: string;

    @Prop()            
    images: string;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Reactions'})
    reactions: Reactions

    @Prop({default: 'unapproved'})
    status: string

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Category'})
    category: Category

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})           //creating a relation to User model
    user: User

}

export const BlogSchema = SchemaFactory.createForClass(Blog);           
// Basically, when you do SchemaFactory.createForClass(Cat)

// Nest will convert the class syntax into the Mongoose schema syntax, so in the end, the result of the conversion would be like this:

// const schema = new mongoose.Schema({
//     name: { type: String } // Notice that `String` is now uppercase.
// });