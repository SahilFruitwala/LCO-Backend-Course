const jwt = require("jsonwebtoken");

// model (optional)
// const User = require("./model/user");

const isAuth = (req, res, next) => {
  const token =
    req.cookies.token ||
    req.body.token ||
    req.header("Authorization").replace("Bearer ", "");

  if (!token) {
    return res.status(403).send("Token Is Missing");
  }

  try {
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decode;
  } catch (error) {
    return res.status(401).send("InValid Token");
  }

  return next();
};

module.exports = isAuth;
