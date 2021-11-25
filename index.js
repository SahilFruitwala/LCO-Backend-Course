const app = require("./app"); // imports express app
const { PORT } = process.env;

app.listen(PORT, () => {
  console.log(`⚡Server is running at 4000...`);
});
