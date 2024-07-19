const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const { sequelize, User, Note } = require("./db");

const app = express();

const PORT = process.env.PORT || 3000;
const JWT_SECRET = "your_jwt_secret";

app.use(bodyParser.json());
app.use(cors());

// User registration
// User registration
app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({ email, password: hashedPassword });
    res.status(201).json(user);
  } catch (error) {
    res.send(error.message);
    res.status(400).json({ error: error.message });
  }
});

// User login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ error: "Invalid credentials" });
  }
  const token = jwt.sign({ userId: user.id }, JWT_SECRET);
  res.json({ token });
});

// Middleware to authenticate requests
const authenticate = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });
  }
};

// CRUD operations for notes
app.get("/notes", authenticate, async (req, res) => {
  const notes = await Note.findAll({ where: { userId: req.userId } });
  res.json(notes);
});

app.post("/notes", authenticate, async (req, res) => {
  const { title, content, tags, color, archived } = req.body;
  try {
    const note = await Note.create({
      userId: req.userId,
      title,
      content,
      tags,
      color,
      archived,
    });
    res.status(201).json(note);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put("/notes/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  const { title, content, tags, color, archived } = req.body;
  const note = await Note.findOne({ where: { id, userId: req.userId } });
  if (!note) {
    return res.status(404).json({ error: "Note not found" });
  }
  try {
    await note.update({ title, content, tags, color, archived });
    res.json(note);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete("/notes/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  const note = await Note.findOne({ where: { id, userId: req.userId } });
  if (!note) {
    return res.status(404).json({ error: "Note not found" });
  }
  await note.destroy();
  res.json({ message: "Note deleted" });
});

sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });
