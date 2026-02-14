const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// In-memory storage
let questions = [];
let studentAnswers = [];
let mediaFiles = [];
let studentPhones = {};

// ============ QUESTIONS ENDPOINTS ============

// Get all questions
app.get("/questions", (req, res) => {
    res.json(questions);
});

// Post a new question
app.post("/questions", (req, res) => {
    const { question, answer } = req.body;
    
    // If answer is provided, update the last question's answer
    if (answer && questions.length > 0) {
        questions[questions.length - 1].answer = answer;
    }
    
    // Add new question
    const newQuestion = {
        id: Date.now(),
        question,
        answer: null,
        date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    };
    
    questions.push(newQuestion);
    
    res.json({ 
        success: true, 
        message: "Question posted successfully",
        question: newQuestion
    });
});

// Get a specific question by ID
app.get("/questions/:id", (req, res) => {
    const question = questions.find(q => q.id === parseInt(req.params.id));
    if (question) {
        res.json(question);
    } else {
        res.status(404).json({ error: "Question not found" });
    }
});

// Update a question's answer
app.put("/questions/:id/answer", (req, res) => {
    const { answer } = req.body;
    const question = questions.find(q => q.id === parseInt(req.params.id));
    
    if (question) {
        question.answer = answer;
        res.json({ success: true, question });
    } else {
        res.status(404).json({ error: "Question not found" });
    }
});

// Delete all questions (admin only - use with caution)
app.delete("/questions/reset", (req, res) => {
    questions = [];
    res.json({ success: true, message: "All questions deleted" });
});

// ============ STUDENT ANSWERS ENDPOINTS ============

// Get all student answers
app.get("/answers", (req, res) => {
    res.json(studentAnswers);
});

// Get answers for a specific question
app.get("/answers/question/:questionId", (req, res) => {
    const answers = studentAnswers.filter(a => a.questionId === parseInt(req.params.questionId));
    res.json(answers);
});

// Submit a student answer
app.post("/answers", (req, res) => {
    const { questionId, studentPin, studentName, answer } = req.body;
    
    // Check if student already answered this question
    const existingAnswer = studentAnswers.find(
        a => a.questionId === questionId && a.studentPin === studentPin
    );
    
    if (existingAnswer) {
        return res.status(400).json({ 
            error: "You have already answered this question" 
        });
    }
    
    const newAnswer = {
        id: Date.now(),
        questionId,
        studentPin,
        studentName,
        answer,
        date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    };
    
    studentAnswers.push(newAnswer);
    
    res.json({ 
        success: true, 
        message: "Answer submitted successfully",
        answer: newAnswer
    });
});

// ============ MEDIA FILES ENDPOINTS ============

// Get all media files
app.get("/media", (req, res) => {
    res.json(mediaFiles);
});

// Upload media file (with opinion)
app.post("/media", (req, res) => {
    const { type, data, fileName, opinion } = req.body;
    
    const newMedia = {
        id: Date.now(),
        type,
        data,
        fileName,
        opinion,
        date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    };
    
    mediaFiles.push(newMedia);
    
    res.json({ 
        success: true, 
        message: "Media uploaded successfully",
        media: newMedia
    });
});

// Get latest media file
app.get("/media/latest", (req, res) => {
    if (mediaFiles.length > 0) {
        res.json(mediaFiles[mediaFiles.length - 1]);
    } else {
        res.status(404).json({ error: "No media files found" });
    }
});

// ============ STUDENT PHONES ENDPOINTS ============

// Get all student phone numbers
app.get("/phones", (req, res) => {
    res.json(studentPhones);
});

// Register/Update student phone
app.post("/phones", (req, res) => {
    const { pin, name, phone } = req.body;
    
    studentPhones[pin] = {
        name,
        phone,
        lastLogin: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    };
    
    res.json({ 
        success: true, 
        message: "Phone registered successfully" 
    });
});

// ============ STATISTICS ENDPOINTS ============

// Get statistics
app.get("/stats", (req, res) => {
    const stats = {
        totalQuestions: questions.length,
        totalAnswers: studentAnswers.length,
        totalMedia: mediaFiles.length,
        totalStudents: Object.keys(studentPhones).length,
        uniqueStudents: [...new Set(studentAnswers.map(a => a.studentPin))].length
    };
    
    res.json(stats);
});

// ============ HEALTH CHECK & INFO ============

app.get("/", (req, res) => {
    res.json({ 
        message: "DEESAAT QUIZ API - Managed by TEJAPRATAP",
        status: "running",
        version: "1.0.0",
        endpoints: {
            questions: "/questions",
            answers: "/answers",
            media: "/media",
            phones: "/phones",
            stats: "/stats"
        }
    });
});

app.get("/health", (req, res) => {
    res.json({ 
        status: "OK", 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// ============ SERVER START ============

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════╗
║     DEESAAT QUIZ SERVER                   ║
║     Managed by TEJAPRATAP                 ║
║     Server running on port ${PORT}          ║
╚═══════════════════════════════════════════╝
    `);
    console.log(`Visit: http://localhost:${PORT}`);
});
