import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { User } from "src/auth/schemas/user.schema";

@Schema({                          //decorator => provide a way to modify or extend the behavior of a class, method, or property
    timestamps:true
})
export class Reactions {
    @Prop()            
    blog_id: string;

    @Prop([{type: mongoose.Schema.Types.ObjectId, ref: 'User'}])
    like: User[]

    @Prop([{type: mongoose.Schema.Types.ObjectId, ref: 'User'}])
    sad: User[]

    @Prop()
    funny: string[]

    @Prop()
    love: string[]

}

export const ReactionsSchema = SchemaFactory.createForClass(Reactions);           
