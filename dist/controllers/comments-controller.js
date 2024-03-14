"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComment = exports.create = exports.getAll = void 0;
const comment_1 = require("../models/comment");
const post_1 = require("../models/post");
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const comments = yield comment_1.Comment.find({ postId: req.params.postId }).populate('user').exec();
        res.status(200).json(comments);
    }
    catch (error) {
        res.status(500).json({
            message: error,
        });
    }
});
exports.getAll = getAll;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doc = new comment_1.Comment({
            text: req.body.text,
            postId: req.params.postId,
            user: req.params.userId
        });
        let comment = yield doc.save()
            .then(c => c.populate('user')).then(c => c);
        yield post_1.Post.findOneAndUpdate({
            _id: req.params.postId,
        }, {
            $inc: { commentsCount: 1 }
        }, {
            new: true
        });
        res.status(200).json(comment);
    }
    catch (error) {
        res.status(500).json({
            message: error,
        });
    }
});
exports.create = create;
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authUserId = req.params.userId;
        const userId = req.body.userId; ///
        const postId = req.body.postId;
        const commentId = req.params.commentId;
        if (authUserId !== userId) {
            return res.status(400).json({ message: "Can't delete the comment" });
        }
        if (!postId || !commentId) {
            return res.status(404).json({ message: "Could't delete the comment" });
        }
        yield comment_1.Comment.findOneAndDelete({
            _id: req.params.commentId
        });
        yield post_1.Post.findOneAndUpdate({ _id: postId }, { $inc: { commentsCount: -1 } }, {
            new: true,
        });
        res.status(200).json({ success: true });
    }
    catch (error) {
        res.status(500).json({
            message: error,
        });
    }
});
exports.deleteComment = deleteComment;
