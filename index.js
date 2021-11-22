const express = require("express");

// Swager docs related
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

// fileupload
const fileupload = require('express-fileupload')

const app = express();

const swaggerDocument = YAML.load("./swagger.yaml");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());
app.use(fileupload());

let courses = [
  {
    id: "11",
    name: "Learn ReactJS",
    price: 299,
  },
  {
    id: "12",
    name: "Learn Angular",
    price: 399,
  },
  {
    id: "13",
    name: "Learn ExpressJs",
    price: 499,
  },
];

app.get("/", (req, res) => {
  res.status(200).send("<h1>Hello from LCO</h1>");
});

app.get("/api/v1/lco", (req, res) => {
  res.send("Hello from LCO Docs");
});

app.get("/api/v1/lcoobject", (req, res) => {
  res.status(200).json(courses[0]);
});

app.get("/api/v1/lcoarray", (req, res) => {
  res.status(200).json(courses);
});

app.get("/api/v1/courses/:id", (req, res) => {
  const myCourse = courses.find((course) => course.id === req.params.id);
  res.json(myCourse);
});

app.get("/api/v1/courses", (req, res) => {
  const location = req.query.location;
  const device = req.query.device;

  res.send({ location, device });
});

app.post("/api/v1/courses", (req, res) => {
  console.log(req.body);
  courses.push(req.body);
  res.send(true);
});

app.post("/api/v1/coursesupload", (req, res) => {
  const file = req.files.file
  const path = __dirname + '/images/' + Date.now() + file.name

  file.mv(path, (err) => {
    res.send(true)
  })
});

app.listen(4000, () => {
  console.log(`Server is running at 4000`);
});
