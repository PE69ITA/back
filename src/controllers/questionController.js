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

module.exports = {
  createQuestion,
  getQuestions,
  getRandomQuestion,
};