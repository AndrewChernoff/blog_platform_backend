import { Request, Response } from "express"
import { Comment } from "../models/comment"
import { Post } from "../models/post"

export const create = async(req: Request, res: Response) => {

    try {
        const doc = new Comment({
            text: req.body.text,
            postId: req.body.postId,
            userId: req.params.userId
        })

        const comment = await doc.save()

        await Post.findOneAndUpdate(
            {
                _id: req.body.postId,
            }, 
            {
                $inc: {commentsCount: 1}
            }, 
            /* {
                new: true
              } */
            )
        
        res.status(200).json(comment)
    } catch (error) {        
        res.status(500).json({
            message: error,
          });
    }
}