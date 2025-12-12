const mongoose = require("mongoose");
const { create } = require("./User");
const UserModel = require("./User");
const { Schema, model } = mongoose;

const PostSchema = new Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "USER" },
  description: { type: String },
  content: { type: String, required: true },
  Image: { type: String, required: true },
},{ timestamps: true }
);



const PostModel = model("Post", PostSchema);
module.exports = PostModel;
