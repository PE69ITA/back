const express = require("express");

const {
  createQuestion,
  getQuestions,
  getRandomQuestion,
  checkAnswer,
} = require("../controllers/questionController");

const router = express.Router();

router.post("/", createQuestion);

router.get("/", getQuestions);

router.get("/random", getRandomQuestion);

router.post("/check", checkAnswer);

module.exports = router;