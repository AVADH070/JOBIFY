import { UnauthonticatedError } from "../errors/index.js";
import jwt from "jsonwebtoken";
const authonaticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log(authHeader);
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new UnauthonticatedError('Authentication invalid');
  }
  const token = authHeader.split(' ')[1];
  // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDBjMDAyY2UwOTg1NDJmZTk4NGE3MTkiLCJpYXQiOjE2Nzg1NDQyMjcsImV4cCI6MTY3ODYzMDYyN30._thxbjQV7S1DoY-nJ4P5Y_UQOTKXg5QAWClyYcfzi7E';

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log("This part called")
    req.user = { userId: payload.userId };
    console.log(req.user)
    next();
  } catch (error) {
    console.log("Error Part exicuted")
    throw new UnauthonticatedError('Authentication invalid');
  }
}

export default authonaticateUser