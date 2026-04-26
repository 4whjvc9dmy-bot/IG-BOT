const express = require("express");
const fs = require("fs-extra");
const multer = require("multer");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

const upload = multer({ dest: "uploads/" });

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/accounts", async (req, res) => {
  try {
    const acc = await fs.readJson("data/accounts.json").catch(() => []);
    acc.push(req.body);
    await fs.writeJson("data/accounts.json", acc);
    res.send("ok");
  } catch (e) {
    res.status(500).send("error");
  }
});

app.post("/upload", upload.single("video"), (req, res) => {
  res.send("uploaded");
});

app.post("/hashtags", async (req, res) => {
  try {
    await fs.writeJson("data/settings.json", req.body);
    res.send("ok");
  } catch (e) {
    res.status(500).send("error");
  }
});

app.post("/start", async (req, res) => {
  try {
    require("./worker")();
    res.send("started");
  } catch (e) {
    res.status(500).send("error");
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
