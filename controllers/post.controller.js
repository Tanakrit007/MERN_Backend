const PostModel = require("../models/Post");
const UserModel = require("../models/User");
const authJwt = require("../middleware/authjwt.middleware");

exports.createPost = async (req, res) => {
  const { title, cover, content, summary } = req.body;
  const authorId = req.authorId;
  if (!title || !cover || !content || !summary) {
    return res.status(400).send({
      message: "Please provide all fields",
    });
  }
  try {
    // ตรวจสอบ Post ซ้ำ
    const existingPost = await PostModel.findOne({ title });
    if (existingPost) {
      return res.status(400).send({ message: "Post title already used" });
    }
    // หา user จาก username
    // const user = await UserModel.findOne({ username });
    // if (!user) {
    //   return res.status(404).send({ message: "User not found" });
    // }
    // สร้าง Post
    const postDoc = await PostModel.create({
      title,
      cover,
      content,
      summary,
      author: authorId,
    });
    if (!postDoc) {
      return res.status(404).send({ message: "Cannot create a new post" });
    }

    res.send({
      message: "Post created successfully",
      data: postDoc,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Something error while creating the post",
    });
  }
};

exports.getAllPost = async (req, res) => {
  try {
    const posts = await PostModel.find().populate("author", ["username"]);
    if (!posts) {
      return res.status(404).send({ message: "Post not found" });
    }
    res.send(posts);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Something error while retrieving the post",
    });
  }
};

exports.getByID = async (req, res) => {
  const { id } = req.params;
  try {
    const posts = await PostModel.findById(id)
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20);
    if (!posts) {
      return res.status(404).send({ message: "Post not found" });
    }
    res.send(posts);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Something error while retrieving the post",
    });
  }
};

exports.getByAuthorID = async (req, res) => {
  const { id } = req.params;
  try {
    const posts = await PostModel.findById({ author: id }).populate("author", [
      "username",
    ]);
    if (!posts) {
      return res.status(404).send({ message: "Post not found" });
    }
    res.send(posts);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Something error while retrieving the post",
    });
  }
};

exports.updatePost = async (req, res) => {
  const { id } = req.params;
  // รับ author (ID ของผู้ใช้) มาด้วยเพื่อเช็คว่าเป็นเจ้าของจริงไหม
  const { title, cover, content, summary } = req.body;
  const authorId = req.authorId;
  if (!id) {
    return res.status(400).json({ message: "Post ID is required" });
  }

  if (!title || !cover || !content || !summary) {
    return res.status(400).json({ message: "ระบุข้อมูลให้ครบทุกช่อง" });
  }

  try {
    // 1. ค้นหาและอัปเดตเฉพาะกรณีที่ ID ตรง และ author ตรงกันเท่านั้น
    const updatedPost = await PostModel.findOneAndUpdate(
      { _id: id, author: authorId }, // เงื่อนไข: ID ของโพสต์ และ ต้องเป็นเจ้าของ
      { title, cover, content, summary },
      { new: true } // ให้คืนค่าข้อมูลใหม่กลับมา
    );

    // 2. ถ้าไม่เจอ updatedPost แปลว่า ID ผิด หรือ ไม่ใช่เจ้าของโพสต์
    if (!updatedPost) {
      return res.status(404).json({
        message: "ไม่พบโพสต์ หรือคุณไม่มีสิทธิ์แก้ไขโพสต์นี้ (ไม่ใช่เจ้าของ)",
      });
    }

    res.send({
      message: "อัปเดตโพสต์สำเร็จ",
      data: updatedPost,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deletePost = async (req, res) => {
  const { id } = req.params;
  const { author } = req.body; // รับ author (ID ของผู้ใช้) มาด้วยเพื่อเช็คว่าเป็นเจ้าของจริงไหม

  if (!id) {
    return res.status(400).json({ message: "Post ID is required" });
  }
  if (!author) {
    return res
      .status(400)
      .json({ message: "ระบุ author ID ของผู้ใช้ที่ทำการลบโพสต์" });
  }
  try {
    const postDoc = await PostModel.findOneAndDelete({ author, _id: id });
    if (!postDoc) {
      return res.status(500).json({
        message: "ไม่พบโพสต์ หรือคุณไม่มีสิทธิ์ลบโพสต์นี้ (ไม่ใช่เจ้าของ)",
      });
    }
    res.send({
      message: "ลบโพสต์สำเร็จ",
      data: postDoc,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
