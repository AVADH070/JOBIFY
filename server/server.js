// import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
import 'express-async-errors'
import express from "express";
const app = express();
import morgan from 'morgan';
import connectDB from "./db/connectDB.js";
import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pathBuild = path.resolve(__dirname, '../client/build')


// MiddleWare file
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandle.js";
import authonaticateUser from './middleware/auth.js';

// Router file
import authRouter from './Router/authRoute.js'
import jobRouter from './Router/jobRoute.js'

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
}

app.use(express.json())
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
// Router
app.use(express.static(pathBuild));
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', authonaticateUser, jobRouter)

app.get('*', function (req, res) {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

// Error 
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 4000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(PORT, () => { console.log(`My Server listenin to the port ${PORT}`); })
  } catch (error) {
    console.log(error);
  }
}

start();