const express = require("express");
const fs = require("fs-extra");
const multer = require("multer");

const app = express();
app.use(express.json());
app.use(express.static("public"));

const upload = multer({ dest: "uploads/" });

app.post("/accounts", async (req, res) => {
  const acc = await fs.readJson("data/accounts.json").catch(() => []);
  acc.push(req.body);
  await fs.writeJson("data/accounts.json", acc);
  res.send("ok");
});

app.post("/upload", upload.single("video"), (req, res) => {
  res.send("ok");
});

app.post("/hashtags", async (req, res) => {
  await fs.writeJson("data/settings.json", req.body);
  res.send("ok");
});

app.post("/start", async (req, res) => {
  require("./worker")();
  res.send("started");
});

app.listen(3000, () => console.log("running"));
