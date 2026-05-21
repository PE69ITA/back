const { PrismaClient } = require("@prisma/client");
const { generateQuestion } = require("../utils/questionGenerator");

const prisma = new PrismaClient();

const createQuestion = async (req, res) => {
  const { question, answer, difficulty, explanation } = req.body;

  const newQuestion = await prisma.question.create({
    data: {
      question,
      answer,
      difficulty,
      explanation,
    },
  });

  res.json(newQuestion);
};

const getQuestions = async (req, res) => {
  const questions = await prisma.question.findMany();

  res.json(questions);
};

const getRandomQuestion = async (req, res) => {
  const { difficulty, exclude } = req.query;

  const excludeId = parseInt(exclude);

  const questions = await prisma.question.findMany({
    where: {
      difficulty,
      ...(excludeId && {
        id: {
          not: excludeId,
        },
      }),
    },
  });

  if (questions.length === 0) {

    const generated = generateQuestion(difficulty);
  
    const savedQuestion = await prisma.question.create({
      data: {
        question: generated.text,
  
        answer: Array.isArray(generated.answer)
          ? generated.answer.join(", ")
          : generated.answer.toString(),
  
        difficulty,
  
        explanation: generated.explanation,
      },
    });
  
    return res.json(savedQuestion);
  }
  if (questions.length < 5) {

    const generated = generateQuestion(difficulty);
  
    await prisma.question.create({
      data: {
        question: generated.text,
  
        answer: Array.isArray(generated.answer)
          ? generated.answer.join(", ")
          : generated.answer.toString(),
  
        difficulty,
  
        explanation: generated.explanation,
      },
    });
  }

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

const generateNewQuestion = async (req, res) => {
  const { difficulty } = req.query;

  const generated = generateQuestion(difficulty);

  const savedQuestion = await prisma.question.create({
    data: {
      question: generated.text,
      answer: Array.isArray(generated.answer)
        ? generated.answer.join(", ")
        : generated.answer.toString(),
      difficulty,
      explanation: generated.explanation,
    },
  });

  res.json(savedQuestion);
};

module.exports = {
  createQuestion,
  getQuestions,
  getRandomQuestion,
  checkAnswer,
  generateNewQuestion,
};