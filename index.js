const express = require("express");
require("dotenv").config();
const PORT = process.env.PORT || 4002;
const app = express();
const User = require("./DB/User");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const sequelize = require("./DB/connect");
// const ejs = require("ejs");
require("./util/workers/emailWorker");
const path = require("path");

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

User.sync();

app.use(
  cors({
    credentials: true,
    origin: [
      process.env.CLIENT_URL,
      process.env.SERVER_URL,
      "http://localhost:4001",
      "http://localhost:4002",
    ],
  })
);

app.use(bodyParser.json());
app.use(cookieParser());
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "views")));
app.get("/", (req, res) => {
  res.send("User- Service");
});

app.use("/v1/api", require("./routes/UserControl"));

app.listen(PORT, () => {
  console.log("Running server on PORT ", PORT);
});
