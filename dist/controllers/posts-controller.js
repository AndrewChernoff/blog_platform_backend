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
exports.updateOne = exports.deleteOne = exports.getOne = exports.getAll = exports.create = void 0;
const post_1 = require("../models/post");
const express_validator_1 = require("express-validator");
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }
        const doc = new post_1.Post({
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags,
            viewsCount: req.body.viewsCount,
            imageUrl: req.body.imageUrl,
            user: req.params.userId
        });
        const post = yield doc.save();
        res.status(200).json(post);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: error,
        });
    }
});
exports.create = create;
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield post_1.Post.find().populate('user').exec();
        res.json(posts);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: error,
        });
    }
});
exports.getAll = getAll;
const getOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = req.params.id;
        const post = yield post_1.Post.findOneAndUpdate({
            _id: postId,
        }, {
            $inc: { viewsCount: 1 }
        }, {
            new: true
        });
        if (!post) {
            return res.status(404).send({ message: "Post is not found" });
        }
        return res.status(400).send(post);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: error,
        });
    }
});
exports.getOne = getOne;
const deleteOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = req.params.id;
        const deletedPost = yield post_1.Post.findOneAndDelete({
            _id: postId,
        });
        if (!deletedPost) {
            return res.status(404).send({ message: "Post is not found" });
        }
        return res.status(400).send({ success: true });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: error,
        });
    }
});
exports.deleteOne = deleteOne;
const updateOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        debugger;
        const postId = req.params.id;
        const post = yield post_1.Post.updateOne({
            _id: postId,
        }, {
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags,
            viewsCount: req.body.viewsCount,
            imageUrl: req.body.imageUrl,
            user: req.params.userId
        });
        if (!post) {
            return res.status(404).send({ message: "Post is not found" });
        }
        return res.send({ success: true });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Couldn't update post",
        });
    }
});
exports.updateOne = updateOne;
