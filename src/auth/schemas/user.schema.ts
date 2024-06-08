import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export enum Role {     //all of them would be of same type and they are static you can not change it in later parts
    Admin = 'admin',
    User = 'user',
    writer = 'writer'
}

@Schema({
    timestamps: true
})

export class User extends Document{           //extending User class with Document to have it's id so that user._id did not give use the error

    @Prop()
    name: string

    @Prop({unique: [true, 'Duplicate email entered']})
    email: string

    @Prop()
    role: Role

    @Prop({default: 'unblocked'})
    status: string

    @Prop()
    profileSummary: string

    @Prop()
    password: string

    @Prop()
    image_url: string




}

export const UserSchema = SchemaFactory.createForClass(User)