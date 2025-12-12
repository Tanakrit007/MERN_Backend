const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const BASE_URL = process.env.BASE_URL;
const PORT = process.env.PORT;
const DB_URL = process.env.DB_URL;

const app = express();

app.use(express.json());
app.use(cors({ origin: BASE_URL, methods: ["GET", "POST", "PUT", "DELETE"] }));
app.get("/", (req, res) => {
  res.send("<h1>Server is running</h1>");
});

//connect to database
if (!DB_URL) {
  console.error("DB_URL is missing. Please set it in the .env file.");
} else {
  mongoose
    .connect(DB_URL)
    .then(() => {
      console.log("Connected to database");
    })
    .catch((err) => {
      console.error("Connection error", error.messages);
    });
}

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
});
