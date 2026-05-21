const express = require("express");

const {
  createQuestion,
  getQuestions,
  getRandomQuestion,
  checkAnswer,
  generateNewQuestion,
} = require("../controllers/questionController");

const router = express.Router();

router.post("/", createQuestion);

router.get("/", getQuestions);

router.get("/random", getRandomQuestion);

router.post("/check", checkAnswer);

router.get("/generate", generateNewQuestion);

module.exports = router;