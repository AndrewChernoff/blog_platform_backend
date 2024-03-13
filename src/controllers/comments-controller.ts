import { Request, Response } from "express"
import { Comment } from "../models/comment"
import { Post } from "../models/post"

export const getAll = async(req: Request, res: Response) => {

    try {
       const comments = await Comment.find({postId: req.params.postId}).populate('user').exec();

        res.status(200).json(comments)
    } catch (error) {        
        res.status(500).json({
            message: error,
          });
    }
}
export const create = async(req: Request, res: Response) => {

    try {
        const doc = new Comment({
            text: req.body.text,
            postId: req.params.postId,
            //userId: req.params.userId,
            user: req.params.userId
        })

        const comment = await doc.save()
        
        await Post.findOneAndUpdate(
            {
                _id: req.params.postId,
            }, 
            {
                $inc: {commentsCount: 1}
            }, 
            {
                new: true
              }
            )
        
        res.status(200).json(comment)
    } catch (error) {        
        res.status(500).json({
            message: error,
          });
    }
}