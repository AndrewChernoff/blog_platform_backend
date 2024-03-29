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
            user: req.params.userId
        })

        let comment = await doc.save()
        .then(c => c.populate('user')).then(c => c)
        
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

export const deleteComment = async(req: Request, res: Response) => {
    try {
        const authUserId = req.params.userId
        const userId = req.body.userId ///
        const postId = req.body.postId
        const commentId = req.params.commentId
        
        if (authUserId !== userId) {
            return res.status(400).json({message: "Can't delete the comment"})
        }

        if(!postId || !commentId) {
            return res.status(404).json({message: "Could't delete the comment"})
        }

        await Comment.findOneAndDelete(
            {
                _id: req.params.commentId
            }
        )

        await Post.findOneAndUpdate(
          { _id: postId },
          { $inc: {commentsCount: -1} },
          {
            new: true,
          }
        );
        
        res.status(200).json({success: true})

    } catch (error) {        
        res.status(500).json({
            message: error,
          });
    }
}