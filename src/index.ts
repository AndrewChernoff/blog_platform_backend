import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { logInValidation, postValidation, registerValidation } from "./validations/registerValidation";
import checkAuth from "./utils/checkAuth";
import multer from 'multer';
import cors from 'cors';
import * as AuthController from './controllers/auth-controller';
import * as PostsController from './controllers/posts-controller';
import * as CommentsController from './controllers/comments-controller'
import handleValidationError from "./utils/handleValidationError";

dotenv.config();

const DB_adress = process.env.MONGO_DBCONNECT_URI as string

mongoose
  .connect(DB_adress)
  .then(() => console.log("DB connected"))
  .catch((error) => console.log("Failed: " + error));

const app: Express = express();

app.use(cors()); 


const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads')
  },
  filename: (_, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}_${file.originalname}`);
  },
})

const upload = multer({storage})

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use('/uploads', express.static('uploads'))

app.post("/upload", upload.single('image'), (req: Request, res: Response) => {
  debugger
  if(req.file) {
  return res.status(200).json({
    url: `/${req.file.path}`/* `/uploads/${req.file.originalname}` */
  })
  } else {
    return res.status(500)
  }
})

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server is running");
});

app.post("/auth/register", registerValidation, handleValidationError, AuthController.register);
app.post("/auth/login", logInValidation, handleValidationError, AuthController.login)
app.get('/auth/me', checkAuth, AuthController.getMe)

app.get('/posts', /* checkAuth, */ PostsController.getAll)
app.post('/posts', checkAuth, postValidation, handleValidationError, PostsController.create)
app.get('/posts/:id', /* checkAuth, */ handleValidationError, PostsController.getOne)
app.delete('/posts/:id', checkAuth, handleValidationError, PostsController.deleteOne)
app.patch('/posts/:id', checkAuth, postValidation, handleValidationError, PostsController.updateOne)
app.get('/tags', PostsController.getLastTags)

app.post('/comments', checkAuth, CommentsController.create)

const port = process.env.PORT || 4444;

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
