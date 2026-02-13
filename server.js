const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

let questions = [];

app.get("/questions", (req, res) => {
    res.json(questions);
});

app.post("/questions", (req, res) => {
    const { question, answer } = req.body;
    questions.push({
        id: Date.now(),
        question,
        answer: null,
        date: new Date().toLocaleString()
    });
    res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on " + PORT));

 
