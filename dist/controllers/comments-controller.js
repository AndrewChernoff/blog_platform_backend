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
exports.create = void 0;
const comment_1 = require("../models/comment");
const post_1 = require("../models/post");
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doc = new comment_1.Comment({
            text: req.body.text,
            postId: req.body.postId,
            userId: req.params.userId
        });
        const comment = yield doc.save();
        yield post_1.Post.findOneAndUpdate({
            _id: req.body.postId,
        }, {
            $inc: { commentsCount: 1 }
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
