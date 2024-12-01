import { Comment } from "../models/comment.model.js";
import { Question } from "../models/question.model.js";
import { User } from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import AsyncHandler from "../utils/AsyncHandler.js";

const createComment = AsyncHandler(async (req, res) => {
    const { questionId, comment } = req.body;
    const userId = req.auth.userId;
  
    if (!userId) {
      return res.status(401).json(new ApiResponse(401, {}, "Unauthorized request", false));
    }

    const user = await User.findOne({userId});
    if (!user) {
        return res.status(404).json(new ApiResponse(404, {}, "User not found", false));
      }
  
    if (!questionId || !comment) {
      return res.status(409).json(new ApiResponse(409, {}, "Question ID and comment are required", false));
    }
  
   
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json(new ApiResponse(404, {}, "Question not found", false));
    }
  

    const newComment = await Comment.create({
      questionId: question._id,
      userId: user._id,
      comment,
    });
  newComment.populate('userId','fullName userName avatar userId');
    // Increment the comment count for the question
    question.comments += 1;
    await question.save();
  
    return res
      .status(201)
      .json(new ApiResponse(201, newComment, "Comment added successfully.", true));
  });
  


  const getCommentsByQuestion = AsyncHandler(async (req, res) => {
    const { questionId } = req.query;
  
    if (!questionId) {
      return res.status(400).json(new ApiResponse(400, {}, "Question ID is required", false));
    }
  

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json(new ApiResponse(404, {}, "Question not found", false));
    }
  
    const comments = await Comment.find({ questionId }).populate('userId','fullName userName avatar userId'); 
  
   
  
    return res.status(200).json(
      new ApiResponse(
        200,
        comments,
        "Comments fetched successfully",
        true
      )
    );
  });
  

export {createComment,getCommentsByQuestion}  