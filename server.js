const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const dotenv = require("dotenv");
dotenv.config();

//Set View Engine and Static Directory Path
const publicDirectoryPath = path.join(__dirname, "./public");
app.use(express.static(publicDirectoryPath));
app.set("view engine", "ejs");

//Import routes
const mainRouter = require("./routes/mainRouter");

//MiddleWares
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(cookieParser());
app.use("/", mainRouter);

let port = process.env.PORT || 3500;

app.get("*", function (req, res) {
  res.redirect("/");
});

app.listen(port, function () {
  return console.log(`Listening on localhost:${port}`);
});
