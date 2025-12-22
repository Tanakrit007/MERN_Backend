const express = require("express");
const router = express.Router();
const postController = require("../controllers/post.controller");
const authJwt = require("../middleware/authjwt.middleware");

//http://localhost:5000/api/v1/posts/create
router.post("/create", authJwt.verifyToken, postController.createPost);

//http://localhost:5000/api/v1/posts/
router.get("/", postController.getAllPost);

//http://localhost:5000/api/v1/posts/1
router.get("/:id", postController.getByID);

//http://localhost:5000/api/v1/posts/author/1
router.get("/author/:id", postController.getByAuthorID);

//http://localhost:5000/api/v1/posts/1
router.put("/:id", authJwt.verifyToken, postController.updatePost);

//http://localhost:5000/api/v1/posts/1
router.delete("/:id", authJwt.verifyToken, postController.deletePost);

module.exports = router;
