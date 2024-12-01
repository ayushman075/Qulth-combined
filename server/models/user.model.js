import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema({
userId:{
    type:String,
    required:true,
    unique:true
},
emailId:{
    type:String,
    required:true,
    unique:true,
    trim:true
},
fullName:{
    type:String,
    trim:true
},
userName:{
    type:String,
    unique:true,
    required:true,
    trim:true
},
avatar:{
    type:String
},
role:{
    type:String,
    enum:["user","admin","moderator"],
    default:"user"
},
followers:{
    type:Number,
    default:0
},
following:{
type:Number,
default:0
}
},
{
    timestamps:true
});

export const User = mongoose.model("User",userSchema);