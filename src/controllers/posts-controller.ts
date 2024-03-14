import { Request, Response } from "express"
import { Post } from "../models/post"

export const create = async(req: Request, res: Response) => {

    try {
        const doc = new Post({
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags,
            viewsCount: req.body.viewsCount,
            imageUrl: req.body.imageUrl,
            user: req.params.userId
        })

        const post = await doc.save()

        res.status(200).json(post)
    } catch (error) {        
        res.status(500).json({
            message: error,
          });
    }
}

export const getAll = async(req: Request, res: Response) => {    
    try {
        const sort = req.query.sort;

        if (sort === 'new') {
            const posts = await Post.find().sort({createdAt: -1}).populate('user').exec();

            res.status(200).json(posts)

        } else if (sort === 'popular') {

            const posts = await Post.find().sort({ viewsCount: -1 }).populate('user').exec();

            res.status(200).json(posts)
        } else {
            res.status(404).json({message: 'Not found'})
        }

    } catch (error) {
        
        res.status(500).json({
            message: error,
          });
    }
}

export const getOne = async(req: Request, res: Response) => {
    try {
        const postId = req.params.id

        const post = await Post.findOneAndUpdate(
        {
            _id: postId,
        }, 
        {
            $inc: {viewsCount: 1}
        }, 
        {
            new: true
        }
        ).populate('user')

          if (!post) {
            return res.status(404).send({message: "Post is not found"})
        }

        return res.status(200).send(post)

    } catch (error) {
        
        res.status(500).json({
            message: error,
          });
    }
}

export const deleteOne = async(req: Request, res: Response) => {
    try {
        
        const postId = req.params.id

        const deletedPost = await Post.findOneAndDelete(
        {
            _id: postId,
        }
        )

          if (!deletedPost) {
            return res.status(404).send({message: "Post is not found"})
        }

        return res.status(200).send({success: true})

    } catch (error) {
        console.log(error);
        
        res.status(500).json({
            message: error,
          });
    }
}

export const updateOne = async(req: Request, res: Response) => {
    try {
        
        const postId = req.params.id

        const post = await Post.updateOne(
        {
            _id: postId,
        },
        {
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags,
            viewsCount: req.body.viewsCount,
            imageUrl: req.body.imageUrl,
            user: req.params.userId
        }
        )

        if(!post) {
            return res.status(404).send({message: "Post is not found"})
        }


        return res.send({success: true})

    } catch (error) {
        console.log(error);
        
        res.status(500).json({
            message: "Couldn't update post",
          });
    }
}
export const getLastTags = async(req: Request, res: Response) => {
    
    try {
        const posts: any = await Post.find().limit(5).exec()
        
        const tags = posts.map((obj: { tags: any; }) => obj.tags).flat().slice(0, 5)
        
        res.json(tags)
    } catch (error) {
        console.log(error);
        
        res.status(500).json({
            message: error,
          });
    }
}