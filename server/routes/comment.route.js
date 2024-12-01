import { Router } from "express"
import { createComment, getCommentsByQuestion } from "../controllers/comment.controller.js"
import { ClerkExpressRequireAuth, ClerkExpressWithAuth } from "@clerk/clerk-sdk-node"

const commentRouter = Router()


commentRouter.route('/create').post(
    ClerkExpressRequireAuth(),
    createComment
)

commentRouter.route('/get').get(
    getCommentsByQuestion
)

export default commentRouter