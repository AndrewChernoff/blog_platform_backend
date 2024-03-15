import { Request, Response } from "express";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../models/user";


export const register =  async (req: Request, res: Response) => {
    try {  
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
      res.status(500).json({
        message: "Couldn't register",
      });
    }
}

export const login = async(req: Request, res: Response) => {

    try {
      
      const user: any = await User.findOne({email: req.body.email})
      
  
      if(!user) {
        return res.status(404).json({message: 'User is not found'})
      }
  
      const isPasswordValid = await bcrypt.compare(req.body.password, user._doc.passwordHash)
      
      if(!isPasswordValid) {
        return res.status(404).json({error: 'Wrong password or email'})
      }
  
      const token = jwt.sign({
        _id: user._doc._id
      },
      'secret',
      {expiresIn: '30d'})
  
      const {passwordHash, ...userData} = user._doc    
  
      res.json({...userData, token})
      
    } catch (error) {
      res.status(500).json({error: "Couldn't login"})
    }
  }

  export const getMe =  async(req: Request, res: Response) => {
    try {
        
      const userId = req.params.userId
  
      const user: any = await User.findById(userId)
  
      if(!user) {
        return res.status(404).json({message: 'User is not found'})
      } 
  
      const {passwordHash, ...userData} = user._doc
      
      res.status(200).json({userData})
  
    } catch (error) {
       res.status(401).json({error: "Not authorized"})
    }
  }
  
  