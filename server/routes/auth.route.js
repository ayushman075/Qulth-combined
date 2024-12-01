import { Router } from "express";
import { checkUniqueUserName, clerkWebhookListener, getUserProfile, updateUserProfile } from "../controllers/auth.controller.js";


import { upload } from "../middlewares/multer.middleware.js";
import authMiddleware from "../middlewares/authenticateRequest.middleware.js";
import { ClerkExpressRequireAuth, ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";





const authRouter = Router()

authRouter.route('/webhook/clerk').post(
    clerkWebhookListener
)
authRouter.route('/get').get(
    ClerkExpressRequireAuth(),
    getUserProfile
)
authRouter.route('/check-username').post(
    ClerkExpressWithAuth(),
    checkUniqueUserName
)
authRouter.route('/update').post(
    ClerkExpressRequireAuth(),
    updateUserProfile
)
export default authRouter
