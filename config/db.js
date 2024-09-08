const mongoose = require("mongoose");
const dotenv = require("dotenv");

//Load env vars
dotenv.config({ path: "./config/config.env" });

const connectDB = async () => {
  mongoose.set("strictQuery", true);
  console.log("uri", process.env.MONGO_URI);
  const conn = await mongoose.connect(process.env.MONGO_URI);

  console.log(`MongoDB Connected: ${conn.connection.host}`);
};

module.exports = connectDB;
