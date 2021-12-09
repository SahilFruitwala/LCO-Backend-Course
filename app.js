const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

// Swager docs related
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const app = express();

// swagger documentation
const swaggerDocument = YAML.load("./swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// regular middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("tiny"));
app.use(cookieParser());
app.use(fileUpload());

// import routes
const home = require("./routes/home");

// router middleware
app.use("/api/v1", home);

// export express app
module.exports = app;
