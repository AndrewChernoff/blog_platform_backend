"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const CommentSchema = new mongoose_1.default.Schema({
    text: {
        type: String,
        requeired: true,
    },
    postId: {
        type: String,
        requeired: true,
    },
    userId: {
        type: String,
        requeired: true,
    },
}, {
    timestamps: true,
});
exports.Comment = mongoose_1.default.model("Comment", CommentSchema);
