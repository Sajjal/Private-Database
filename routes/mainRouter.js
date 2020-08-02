const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const path = require("path");
const publicDirectoryPath = path.join(__dirname, "../public");
const multer = require("multer");

const { verifyUser, saveExpiredToken, removeExpiredToken } = require("../modules/verifyToken");
const { readFile, saveData, getData, updateData, removeData, getFileName, getSingleRecord } = require("../modules/readWriteFile");
const { createBackup, restoreBackup } = require("../modules/backup");

// Upload Backup file and Rename it as data.zip
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/backup");
  },
  filename: function (req, file, cb) {
    cb(null, "data.zip");
  },
});
const upload = multer({ storage: storage });

router.get("/", verifyUser, (req, res) => {
  return res.redirect("/dashboard");
});

router.post("/", async (req, res) => {
  //const data = await getData("user");
  const username = req.body.username.toString();
  const password = req.body.password.toString();

  //if (username !== data[0].question || password !== data[0].answer) return res.render("index", { message: "Invalid Login!" });
  if (username !== "admin" || password !== "admin") return res.render("index", { message: "Invalid Login!" });

  //If everything is valid Create and assign a token. Token Expires in 2 hours
  const accessToken = jwt.sign({ id: "mrsajjal" }, process.env.TOKEN_SECRET, {
    expiresIn: "7200s",
  });

  // Remove old expired tokens
  await removeExpiredToken();

  //Save accessToken to Client's Browser Cookie and Redirect to Dashboard
  return res.cookie("accessToken", accessToken).redirect("/dashboard");
  // return res.cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: "strict" }).redirect("/dashboard");
});

router.get("/dashboard", verifyUser, async (req, res) => {
  const page = req.query.page || 1;
  const data = await readFile("./data/index.json");
  let posts = await getData(`data${page}`);

  // Check for Valid Decryption Key
  if (posts && posts[0].question == 0 && posts[0].answer == 0) return res.render("index", { message: "Invalid Decryption Key!" });

  if (!posts) posts = [];
  let pages = 1;
  if (data) pages = JSON.parse(data).length;
  return res.render("dashboard", { message: "Dashboard", posts, currentPage: page, pages });
});

router.get("/add", verifyUser, (req, res) => {
  return res.render("addData", { message: "Add Record" });
});

router.post("/add", verifyUser, async (req, res) => {
  const data = {
    question: req.body.question.toString(),
    answer: req.body.answer.toString(),
    id: parseInt(Date.now()),
  };
  await saveData(data);
  return res.redirect("/dashboard");
});

router.get("/edit", verifyUser, async (req, res) => {
  if (!req.query.id) return res.redirect("/");
  const data = await getSingleRecord(req.query.id);
  if (!data) return res.redirect("/");
  return res.render("editData", { message: "Edit Record", data });
});

router.post("/edit", verifyUser, async (req, res) => {
  const data = {
    question: req.body.question.toString(),
    answer: req.body.answer.toString(),
    id: parseInt(req.body.id),
  };
  await updateData(req.body.fileName, data);
  return res.redirect("/");
});

router.get("/delete", verifyUser, async (req, res) => {
  if (!req.query.id) return res.redirect("/");
  const fileName = await getFileName(req.query.id);
  if (fileName == null) return res.redirect("/");
  await removeData(fileName, req.query.id);
  return res.redirect("/");
});

router.get("/backup", verifyUser, (req, res) => {
  return res.render("backup", { message: "Backup/Restore" });
});

router.post("/backup", verifyUser, upload.single("dataFile"), async (req, res) => {
  await restoreBackup();
  return res.redirect("/");
});

router.get("/dataBackup", verifyUser, async (req, res) => {
  await createBackup();
  return res.sendFile(publicDirectoryPath + "/backup/data.zip");
});

router.get("/logout", verifyUser, async (req, res) => {
  const token = req.cookies.accessToken;
  const date = Date.now();
  await saveExpiredToken(token, date);
  return res.redirect("/");
});

module.exports = router;
