import mongoose from "mongoose";

const questionSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    question: { type: String, required: true },
    tags : [{type:String}],
    createdAt: { type: Date, default: Date.now },
    status: { type: String, default: "Pending", enum:["Pending","Approved","Disapproved"] },
    likes : {type:Number,default:0},
    comments : {type:Number,default:0},
    likesList:    [{type:String}],
    dislikes : {type:Number,default:0},
    dislikesList: [{type:String}],
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    approvedAt: { type: Date },
})

export const Question = mongoose.model("Question", questionSchema);