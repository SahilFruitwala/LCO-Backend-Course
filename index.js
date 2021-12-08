require("dotenv").config();

const express = require("express");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;

const app = express();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// view-engine
app.set("view engine", "ejs");

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.get("/myget", (req, res) => {
  res.send(req.query);
});

app.post("/mypost", async (req, res) => {
  // ! Multiple files handling
  const imageArray = [];

  if (req.files) {
    for (const file of req.files.samplefile) {
      const result = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "users",
      });

      imageArray.push({
        public_id: result.public_id,
        secure_url: result.secure_url,
      });
    }
  }

  // ! Single file handling
  // const file = req.files.samplefile;
  // const result = await cloudinary.uploader.upload(file.tempFilePath, {
  //   folder: "users",
  // });

  details = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    imageArray ,
  };
  res.send(details);
});

app.get("/getform", (req, res) => {
  res.render("getform");
});

app.get("/postform", (req, res) => {
  res.render("postform");
});

app.listen(4000, () => {
  console.log("Server running on port 4000...");
});
