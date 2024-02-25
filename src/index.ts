import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import mongoose, { Model } from "mongoose";
import { registerValidation } from "./validations/registerValidation";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import { User } from "./models/user";

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
  res.send("Express + TypeScript Server fghfghfgjgfhg");
});

app.post(
  "/auth/login",
  registerValidation,
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }

      const salt = await bcrypt.genSalt(10);

      const hash = await bcrypt.hash(req.body.password, salt);

      const doc = new User({
        fullName: req.body.fullName,
        email: req.body.email,
        avatarUrl: req.body.avatarUrl,
        passwordHash: hash,
      });

      const user: any = await doc.save();

      const token = jwt.sign(
        {
        _id: user._id,
        },
      'secret register',
      {
        expiresIn: '30d',
      }
      )

      const {passwordHash, ...userData} = user._doc

      res.json({...userData, token});
    
    } catch (error) {
      console.log(error);

      res.status(400).json({
        message: "Couldn't register",
      });
    }
  }
);

app.listen(4444, () => {
  console.log(`[server]: Server is running at http://localhost:${4444}`);
});
