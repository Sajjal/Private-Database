const jwt = require("jsonwebtoken");
const fs = require("fs").promises;

async function verifyUser(req, res, next) {
  const token = req.cookies.accessToken;
  if (!token) return res.status(400).render("index", { message: "Please Login !" });

  //Check if the token is in InvalidToken DataBase
  checkInvalidToken = await searchToken(token);
  if (checkInvalidToken && checkInvalidToken.token == token) {
    return res.status(400).render("index", { message: "Logged out!" });
  }

  //Verify token and Allow access if Everything is good
  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch {
    res.status(400).render("index", { message: "Please Login !" });
  }
}

/******************** Keep Track of Invalid Token**********************/

async function readExpiredToken() {
  try {
    const token = await fs.readFile(`./expiredTokens/expiredToken.json`, "binary");
    return JSON.parse(token);
  } catch {
    return;
  }
}

async function saveExpiredToken(token, id) {
  let oldData = await readExpiredToken();
  if (!oldData) oldData = [];
  const data = { token, id };
  oldData.push(data);
  try {
    await fs.writeFile(`./expiredTokens/expiredToken.json`, JSON.stringify(oldData, null, 2), "utf-8");
    return;
  } catch {
    return;
  }
}

async function removeExpiredToken() {
  let tokens;
  const date = Date.now() + -7210000; // Little more than two hours old

  tokens = await readExpiredToken();
  if (!tokens || tokens.length <= 1) return;
  activeTokens = tokens.filter((token) => {
    return token.id >= date;
  });
  return await fs.writeFile(`./expiredTokens/expiredToken.json`, JSON.stringify(activeTokens, null, 2), "utf-8");
}

async function searchToken(token) {
  const tokens = await readExpiredToken();
  if (tokens)
    for (let i = 0; i < tokens.length; i++) {
      if (token == tokens[i].token) return tokens[i];
    }
  return;
}

module.exports = { verifyUser, saveExpiredToken, removeExpiredToken };
