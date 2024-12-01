import { Router } from "express";
import { ClerkExpressRequireAuth, ClerkExpressWithAuth } from '@clerk/clerk-sdk-node'
import { approveQuestion, createQuestion, deleteQuestion, disapproveQuestion, editQuestion, getQuestionById, getQuestions } from "../controllers/question.controller.js";
const questionRouter = Router()


questionRouter.route('/create').post(
    ClerkExpressRequireAuth(),
    createQuestion
)

questionRouter.route('/edit').post(
    ClerkExpressRequireAuth(),
    editQuestion
)

questionRouter.route('/approve').post(
    ClerkExpressRequireAuth(),
    approveQuestion
)

questionRouter.route('/disapprove').post(
    ClerkExpressRequireAuth(),
    disapproveQuestion
)

questionRouter.route('/delete').get(
    ClerkExpressRequireAuth(),
    deleteQuestion
)

questionRouter.route('/get').get(
    getQuestions
)

questionRouter.route('/getById').get(
    getQuestionById
)

export default questionRouter