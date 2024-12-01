import { authenticateRequest } from "@clerk/express";


const authMiddleware = async (req, res, next) => {
  try {
    const authData = await authenticateRequest(req);
    console.log(req.headers)
    req.auth = authData;
    next(); 
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).send("Unauthorized");
  }
};


export default authMiddleware
