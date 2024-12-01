import { Question } from "../models/question.model.js";
import { User } from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import AsyncHandler from "../utils/AsyncHandler.js";


const createQuestion = AsyncHandler(async (req,res)=>{
    const {  question,tags } = req.body;
    const userId = req.auth.userId;
console.log(question);
console.log(tags);
    if(!userId){
       return res.status(401).json(new ApiResponse(401,{},"Unauthorized request",false))
    }
    if (!question || !tags) {
        return res.status(409).json(new ApiResponse(409,{},"Question is Required",false))
    }
  const user = await User.findOne({userId});
  if(!user){
    return res.status(404).json(new ApiResponse(404,{},"User not found",false))

  }
    const newQuestion = await Question.create({
      userId:user._id,
      question,
      tags,
      status: "Pending",
      createdAt: new Date(),
      likes: 0,
      comments: 0,
    });
  

    return res.status(201).json(new ApiResponse(201,newQuestion,"Question created successfully. Awaiting admin approval.",true))

})

const editQuestion = AsyncHandler(async (req,res)=>{

    
    const { id,question,tags} = req.body;
    const userId = req.auth.userId
  
    if (!question) {
        return res.status(409).json(new ApiResponse(409,{},"Question is Required",false))
    }
    const user = await User.findOne({userId});
  if(!user){
    return res.status(404).json(new ApiResponse(404,{},"User not found",false))
  }
  const oldQuestion = Question.findById(id)

    if(!oldQuestion.userId===user._id){
        return res.status(401).json(new ApiResponse(401,{},"Unautorized Request",false))
    }
    const updatedQuestion = await Question.findByIdAndUpdate(
      id,
      { question,tags, status: "Pending" }, 
      { new: true } 
    );
  
    if (!updatedQuestion) {
        return res.status(404).json(new ApiResponse(404,{},"Question not found",false))

    }
  
    return res.status(201).json(new ApiResponse(201,updatedQuestion,"Question updated successfully. Awaiting admin approval.",true))


})

const approveQuestion = AsyncHandler(async (req,res)=>{
    const { questionId } = req.body; 
    const  userId  = req.auth.userId;
  
    const question = await Question.findById(questionId);
    if (!question) {
        return res.status(404).json(new ApiResponse(404,{},"Question not found",false))
    }
  
    if (question.status==="Approved") {
        return res.status(409).json(new ApiResponse(409,{},"Question already approved",false))
    }
    const user = await User.findOne({userId});
  if(!user){
    return res.status(404).json(new ApiResponse(404,{},"User not found",false))
  }
  if(user.role!=="admin"){
    return res.status(401).json(new ApiResponse(401,{},"Unautorized Request",false))
  }
    question.status = "Approved";
    question.approvedBy = user._id;
    question.approvedAt = new Date();
  
    await question.save();
  
    return res.status(200).json(new ApiResponse(200,question,"Question approved successfully",true))

})

const disapproveQuestion = AsyncHandler(async (req,res)=>{
    const { questionId } = req.body; 
    const userId = req.auth.userId
    const question = await Question.findById(questionId);
    if (!question) {
        return res.status(404).json(new ApiResponse(404,{},"Question not found",false))
    }

    const user = await User.findOne({userId});
    if(!user){
      return res.status(404).json(new ApiResponse(404,{},"User not found",false))
    }
    if(user.role!=="admin"){
      return res.status(401).json(new ApiResponse(401,{},"Unautorized Request",false))
    }
  
    if (!question.status=="Disapproved") {
        return res.status(409).json(new ApiResponse(409,{},"Question already disapproved",false))
    }
  
    question.status = "Disapproved";
    question.approvedBy = null;
    question.approvedAt = null;
  
    await question.save();
  
    return res.status(200).json(new ApiResponse(200,question,"Question disapproved successfully",true))
})

const deleteQuestion = AsyncHandler(async (req,res)=>{
    const { questionId } = req.query; 
    const userId = req.auth.userId;

    const user = await User.findOne({userId});
    if(!user){
      return res.status(404).json(new ApiResponse(404,{},"User not found",false))
    }
    const oldQuestion =await Question.findById(questionId)
    
      if(oldQuestion.userId.toString===user._id.toString || user.role==="admin"){
       await Question.findByIdAndDelete(questionId);
   
      }
else{
  return res.status(401).json(new ApiResponse(401,{},"Unautorized Request for deletion",false))

}
    
  
    return res.status(200).json(new ApiResponse(200,{},"Question deleted successfully",true))
})

const getQuestions = AsyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, userId, search } = req.query;

  const pageNumber = parseInt(page, 10);
  const pageSize = parseInt(limit, 10);
  const skip = (pageNumber - 1) * pageSize;

  const filter = {};
  if (status !== undefined) {
    filter.status = status
  }
  if (search) {
    filter.question = { $regex: search, $options: "i" };
  }

  if(userId){
    const user = await User.findOne({userId});
    if(user){
      filter.userId=user._id;
    }
  }

  const total = await Question.countDocuments(filter);
  const questions = await Question.find(filter)
    .populate('userId', 'fullName userName avatar userId')
    .sort({ createdAt: -1 })
    .skip(skip) 
    .limit(pageSize); 

    return res.status(200).json(new ApiResponse(200,{total,currentPage:pageNumber,totalPages: Math.ceil(total / pageSize),
      pageSize,
      questions},"Question retrieved successfully",true))
});


const getQuestionById = AsyncHandler(async (req, res) => {
  const { id } = req.query;


  const question = await Question.findById(id).populate('userId', 'fullName userName avatar userId');

  if (!question) {
           return res.status(404).json(new ApiResponse(404,{},"Question not found",false))

  }

  res.status(200).json(new ApiResponse(200,question,"Question retrieved successfully"));
});
export {createQuestion,editQuestion,approveQuestion,disapproveQuestion,deleteQuestion,getQuestions,getQuestionById}