const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const createQuestion = async (req, res) => {
  const { question, answer, difficulty } = req.body;

  const newQuestion = await prisma.question.create({
    data: {
      question,
      answer,
      difficulty,
    },
  });

  res.json(newQuestion);
};

const getQuestions = async (req, res) => {
  const questions = await prisma.question.findMany();

  res.json(questions);
};

const getRandomQuestion = async (req, res) => {
  const { difficulty } = req.query;

  const questions = await prisma.question.findMany({
    where: {
      difficulty,
    },
  });

  const randomQuestion =
    questions[Math.floor(Math.random() * questions.length)];

  res.json(randomQuestion);
};

const checkAnswer = async (req, res) => {
  const { questionId, answer } = req.body;

  const question = await prisma.question.findUnique({
    where: {
      id: questionId,
    },
  });

  if (!question) {
    return res.status(404).json({
      message: "Question not found",
    });
  }

  const correct =
    question.answer.toString().trim() ===
    answer.toString().trim();

  res.json({
    correct,
  });
};

module.exports = {
  createQuestion,
  getQuestions,
  getRandomQuestion,
  checkAnswer,
};