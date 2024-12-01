import connectDB from "./database/connectDB.js";
import dotenv from "dotenv";
import express from 'express';
import cors from "cors";
import cookieParser from "cookie-parser";
import { ClerkExpressWithAuth,ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";

const app = express();

dotenv.config({
    path: '.env'
});


app.use(cors(
    {
    origin:["http://localhost:5173", "http://localhost","http://localhost:8000","https://qulth.vercel.app"],
    methods:["GET","POST","OPTIONS","UPDATE","DELETE"],
    credentials: true
}
));



app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}));
app.use(express.static("public"));
app.use(cookieParser());


app.use(express.static("public"));
app.use(cookieParser());




//Route Import
import authRouter from "./routes/auth.route.js";
import questionRouter from "./routes/question.route.js";
import commentRouter from "./routes/comment.route.js";
import likeRouter from "./routes/like.route.js";


app.use("/api/v1/auth", express.raw({ type: "application/json" }), authRouter);
app.use("/api/v1/question",  questionRouter);
app.use("/api/v1/comment",  commentRouter);
app.use("/api/v1/like",   likeRouter);

app.get('/', (req, res) => {
    res.send('Welcome to Qulth, on this line you are talking to Qulth server !!');
});


connectDB().then(() => {
    const port = process.env.PORT || 3005;
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
}).catch((err) => {
    console.log("Error connecting to database !!", err);
});
export default app;
