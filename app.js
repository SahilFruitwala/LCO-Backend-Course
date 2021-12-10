const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

// import routes
const home = require("./routes/home");
const user = require("./routes/user");

// Swager docs related
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const app = express();

// swagger documentation
const swaggerDocument = YAML.load("./swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// view engine
app.set("view engine", "ejs");

// regular middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("tiny"));
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// router middleware
app.use("/api/v1", home);
app.use("/api/v1", user);

app.get("/api/v1/signuptest", (req, res) => {
    res.render('postForm')
});

// export express app
module.exports = app;
