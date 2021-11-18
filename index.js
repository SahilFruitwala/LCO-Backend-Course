const express = require("express");

// Swager docs related
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const app = express();

const swaggerDocument = YAML.load("./swagger.yaml");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => {
  res.status(200).send("<h1>Hello from LCO</h1>");
});

app.listen(4000, () => {
  console.log(`Server is running at 4000`);
});
