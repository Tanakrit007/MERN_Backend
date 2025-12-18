const mongoose = require("mongoose");
const { Schema, model } = mongoose;

// PostModel.js
const PostSchema = new Schema(
  {
    title: { type: String, required: true },
    summary: { type: String, required: true, min: 10, max: 600 },
    content: { type: String, required: true },
    cover: { type: String, required: true },
    // แก้จาก "USER" เป็น "User" (ให้ตรงกับที่คุณตั้งใน UserModel)
    author: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const PostModel = model("Post", PostSchema);
module.exports = PostModel;
