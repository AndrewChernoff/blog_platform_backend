import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { postValidation, registerValidation } from "./validations/registerValidation";
import checkAuth from "./utils/checkAuth";
import * as AuthController from './controllers/auth-controller'
import * as PostsController from './controllers/posts-controller'

mongoose
  .connect(
    "mongodb+srv://whitedrew538:wwwwwwwwww@cluster0.z6b0ju0.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("DB connected"))
  .catch((error) => console.log("Failed: " + error));

const app: Express = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.post("/auth/register", registerValidation, AuthController.register);
app.post("/auth/login", AuthController.login)
app.get('/auth/me', checkAuth, AuthController.getMe)

app.get('/posts', checkAuth, postValidation, PostsController.getAll)
app.post('/posts', checkAuth, postValidation, PostsController.create)
app.get('/posts/:id', checkAuth, postValidation, PostsController.getOne)
app.patch('/posts/:id', checkAuth, PostsController.updateOne)

app.listen(4444, () => {
  console.log(`[server]: Server is running at http://localhost:${4444}`);
});
