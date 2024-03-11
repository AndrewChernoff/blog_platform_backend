import { Request, Response } from "express"
import { Comment } from "../models/comment"

export const create = async(req: Request, res: Response) => {

    try {
        
        const doc = new Comment({
            text: req.body.text,
            postId: req.body.postId,
            userId: req.params.userId
        })

        const comment = await doc.save()
        
        res.status(200).json(comment)
    } catch (error) {        
        res.status(500).json({
            message: error,
          });
    }
}