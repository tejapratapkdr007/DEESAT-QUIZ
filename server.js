const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

let questions = [];
let studentAnswers = [];
let studentPhones = {};
let mediaFiles = [];

app.post("/post-question", (req, res) => {
  questions.push(req.body);
  res.json({ message: "Question saved" });
});

app.get("/questions", (req, res) => {
  res.json(questions);
});

app.post("/submit-answer", (req, res) => {
  studentAnswers.push(req.body);
  res.json({ message: "Answer saved" });
});

app.get("/answers", (req, res) => {
  res.json(studentAnswers);
});

app.post("/save-phone", (req, res) => {
  studentPhones[req.body.pin] = req.body;
  res.json({ message: "Phone saved" });
});

app.get("/phones", (req, res) => {
  res.json(studentPhones);
});

app.post("/upload-media", (req, res) => {
  mediaFiles.push(req.body);
  res.json({ message: "Media saved" });
});

app.get("/media", (req, res) => {
  res.json(mediaFiles);
});

app.listen(3000, () => console.log("Server running on port 3000"));