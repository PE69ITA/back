const express = require("express");

const {
  createQuestion,
  getQuestions,
  getRandomQuestion,
} = require("../controllers/questionController");

const router = express.Router();

router.post("/", createQuestion);

router.get("/", getQuestions);

router.get("/random", getRandomQuestion);

module.exports = router;