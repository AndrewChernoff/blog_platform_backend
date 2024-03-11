import mongoose  from "mongoose";

const CommentSchema = new mongoose.Schema({
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


export const Comment = mongoose.model("Comment", CommentSchema);
