require("dotenv").config();
const app = require("./app");

const connectDB = require("./config/db");
const cloudinary = require("cloudinary").v2;

const PORT = process.env.PORT || 4000;

// mongo connection
connectDB();

// cloudinary connection
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.listen(PORT, () => {
  console.log(`⚡Server running on port ${PORT}...`);
});
