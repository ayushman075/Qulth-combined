import { Question } from "../models/question.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import AsyncHandler from "../utils/AsyncHandler.js";


const likeQuestion = AsyncHandler(async (req, res) => {
  const { questionId } = req.body;
  const userId = req.auth.userId;

  if(!questionId){
    return res.status(409).json(new ApiResponse(409,{},"Question ID is required",false))

  }

  const question = await Question.findById(questionId);

  if (!question) {
    return res.status(404).json(new ApiResponse(404,{},"Question not found",false))
  }

  if (question.likesList?.includes(userId)) {
    question.likesList = question.likesList.filter((id) => id.toString() !== userId);
    question.likes -= 1;
  } else {
    question.likesList.push(userId);
    question.likes += 1;

    if (question.dislikesList?.includes(userId)) {
      question.dislikesList = question.dislikesList.filter((id) => id.toString() !== userId);
      question.dislikes -= 1;
    }
  }

  await question.save();

  res.status(200).json(new ApiResponse(200,{likes: question.likes,
    dislikes: question.dislikes},"Like updated successfully",true))
});

const dislikeQuestion = AsyncHandler(async (req, res) => {
  const { questionId } = req.body;
  const userId = req.auth.userId;

  if(!questionId){
    return res.status(409).json(new ApiResponse(409,{},"Question ID is required",false))

  }


  const question = await Question.findById(questionId);

  if (!question) {
    return res.status(404).json(new ApiResponse(404,{},"Question not found",false))
  }

  if (question.dislikesList?.includes(userId)) {
    question.dislikesList = question.dislikesList.filter((id) => id.toString() !== userId);
    question.dislikes -= 1;
  } else {
    question.dislikesList.push(userId);
    question.dislikes += 1;

    if (question.likesList?.includes(userId)) {
      question.likesList = question.likesList.filter((id) => id.toString() !== userId);
      question.likes -= 1;
    }
  }

  await question.save();

  res.status(200).json(new ApiResponse(200,{likes: question.likes,
    dislikes: question.dislikes},"Disliked updated successfully",true))

});

export { likeQuestion, dislikeQuestion };