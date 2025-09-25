import dotenv from "dotenv";
import express from "express";
// const Document = require("../models/Document");
// const upload = require("../middleware/upload");
// const connectDB = require("../config/db")
import { connectDB } from "../config/db.js";
// const router = express.Router();

const app = express();

// Connect to the database
dotenv.config();
connectDB();

// Get all documents for a user
app.get("/", (req, res) => {
  res.send("API is running...");
});
//

// module.exports = router;
