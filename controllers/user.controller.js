const bcrypt = require("bcrypt");
const UserModel = require("../models/User");
const salt = bcrypt.genSaltSync(10);

// Register User
exports.register = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Please provide username and password" });
  }

  const existingUser = await UserModel.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ message: "Username is already used" });
  }
  try {
    const hashedPassword = bcrypt.hashSync(password, salt);
    const user = await UserModel.create({ username, password: hashedPassword });
    res.send({ message: "User created successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || "Something occurred while regis" });
  }
};
