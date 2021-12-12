const User = require("../models/user");
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");
const cookieToken = require("../utils/cookieToken");

const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;

const emailHelper = require("../utils/emailHelper");
const crypto = require("crypto");

exports.signup = BigPromise(async (req, res, next) => {
  if (!req.files) {
    return next(new CustomError("Photo is required for signup!", 400));
  }

  const { name, email, password } = req.body;
  if (!email || !name || !password) {
    return next(new CustomError("Name, email and password are require!", 400));
  }

  const file = req.files.profilePic;
  const result = await cloudinary.uploader.upload(file.tempFilePath, {
    folder: "users",
    width: 150,
    crop: "scale",
  });

  const user = await User.create({
    name,
    email,
    password,
    photo: {
      id: result.public_id,
      secure_url: result.secure_url,
    },
  });

  cookieToken(user, res);
});

exports.signin = BigPromise(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new CustomError("Email and password are require!", 400));
  }

  // check if user exist or not
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new CustomError("Enter valid email and password!", 400));
  }

  // compare password
  const isPasswordCorrect = await user.isPasswordValidate(password);
  if (!isPasswordCorrect) {
    console.log(password, isPasswordCorrect);
    return next(new CustomError("Enter valid email and password!", 400));
  }

  // generate JWT
  const token = await user.getJWTToken();

  cookieToken(user, res);
});

exports.signout = BigPromise(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logout Success!",
  });
});

exports.forgotPassword = BigPromise(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new CustomError("Email and password are require!", 400));
  }

  // check if user exist or not
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(
      new CustomError("Account with given email does not exists!", 400)
    );
  }

  const forgotToken = await user.getForgotPasswordToken();

  await user.save({ validateBeforeSave: false });

  const myURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${forgotToken}`;

  const message = `Copy and paste the given link into your browser:\n\n${myURL}`;

  try {
    await emailHelper({
      toMail: email,
      subject: "Reset Password",
      message,
    });

    res.status(200).json({
      success: true,
      message: "Reset email sent!",
    });
  } catch (error) {
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
    user.save({ validateBeforeSave: false });

    return next(new CustomError(error.message, 500));
  }
});

exports.resetPassword = BigPromise(async (req, res, next) => {
  const token = req.params.token;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    forgotPasswordToken: hashedToken,
    forgotPasswordExpiry: { $gt: Date.now() },
  });
  if (!user) {
    return next(new CustomError("Token is either invalid or expired!", 400));
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new CustomError("Passwords do not match!", 400));
  }

  user.password = req.body.password;
  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpiry = undefined;

  await user.save();

  cookieToken(user, res);
});

exports.getUserDeatils = BigPromise(async (req, res, next) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

exports.changePassword = BigPromise(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordCorrect = await user.isPasswordValidate(req.body.oldPassword);

  if (!isPasswordCorrect) {
    return next(new CustomError("Password does not match!", 400));
  }

  user.password = req.body.newPassword;

  await user.save();

  cookieToken(user, res);
});

exports.updateUserDetails = BigPromise(async (req, res, next) => {

  const {name, email} = req.body

  if(!name || !email) {
    return next(new CustomError("Please provide name and email!", 400))
  }

  const newData = {
    name: name,
    email: email,
  };
  

  if (req.files) {
    const imageId = req.user.photo.id;
    const response = await cloudinary.uploader.destroy(imageId);

    const file = req.files.profilePic;
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "users",
      width: 150,
      crop: "scale",
    });

    newData.photo = { id: result.public_id, secure_url: result.secure_url };
  }

  const user = await User.findByIdAndUpdate(req.user.id, newData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});
