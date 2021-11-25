// dependencies
require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

// model
const User = require("./model/user");
const isAuth = require("./middleware/auth");

const app = express();

// middleware
app.use(express.json());
app.use(cookieParser());

// routes
app.get("/", (req, res) => {
  res.send("Hello Wordl!");
});

app.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!(email && password && firstName && lastName)) {
      res.status(400).send("All fields are required!");
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() }); // returns promise
    if (existingUser) {
      res.status(401).send("User already exists!");
    }

    // password encryption
    const encryptedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: encryptedPassword,
    });
    // token generation
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.SECRET_KEY,
      {
        expiresIn: "2h",
      }
    );

    user.token = token;
    user.password = undefined;

    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", async (req, res) => {
  try {
    //   res.clearCookie("token");
    const { email, password } = req.body;
    if (!(email && password)) {
      res.status(401).send("Fill All Details!");
    }
    const user = await User.findOne({ email: email.toLowerCase() });

    // console.log(await bcrypt.compare(password, user.password));

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ user_id: user._id }, process.env.SECRET_KEY, {
        expiresIn: "2h",
      });

      user.token = token;
      user.password = undefined;

      //   res.status(200).json(user);

      // user cookies
      const options = {
        expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        httponly: true,
      };

      res.status(200).cookie("token", token, options).json({
        success: true,
      });

      return;
    }

    res.status(400).send("Email or Password is Incorrect!");
  } catch (error) {
    console.log(error);
  }
});

app.get("/dashboard", isAuth, (req, res) => {
  res.send("GOT IT!");
});

// export
module.exports = app;
