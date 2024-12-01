import { ClerkExpressRequireAuth, ClerkExpressWithAuth } from "@clerk/clerk-sdk-node"
import { Router } from "express"
import { dislikeQuestion, likeQuestion } from "../controllers/like.controller.js"


const likeRouter = Router()


likeRouter.route('/likeQuestion').post(
    ClerkExpressRequireAuth(),
    likeQuestion
)

likeRouter.route('/dislikeQuestion').post(
    ClerkExpressRequireAuth(),
    dislikeQuestion
)

export default likeRouter