const { PrismaClient } = require("@prisma/client");
const { generateQuestion } = require("../utils/aiGenerator");

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

  let questions = await prisma.question.findMany({
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

    let totalQuestions = await prisma.question.count();

    if (totalQuestions >= 249) {

      const oldestQuestion = await prisma.question.findFirst({
        orderBy: {
          id: "asc",
        },
      });

      if (oldestQuestion) {
        await prisma.question.delete({
          where: {
            id: oldestQuestion.id,
          },
        });
      }
    }

    const generated = await generateQuestion(difficulty);

    const savedQuestion = await prisma.question.create({
      data: {
        question: generated.question,

        answer: generated.answer,

        difficulty: generated.difficulty,

        explanation: generated.explanation,
      },
    });

    return res.json(savedQuestion);
  }

  // Автоматическая AI генерация
  try {

    let totalQuestions = await prisma.question.count();

    if (totalQuestions >= 249) {

      const oldestQuestion = await prisma.question.findFirst({
        orderBy: {
          id: "asc",
        },
      });

      if (oldestQuestion) {
        await prisma.question.delete({
          where: {
            id: oldestQuestion.id,
          },
        });
      }
    }

    const generated = await generateQuestion(difficulty);

    await prisma.question.create({
      data: {
        question: generated.question,

        answer: generated.answer,

        difficulty: generated.difficulty,

        explanation: generated.explanation,
      },
    });

    questions = await prisma.question.findMany({
      where: {
        difficulty,

        ...(excludeId && {
          id: {
            not: excludeId,
          },
        }),
      },
    });

  } catch (error) {
    console.error("AI generation error:", error.message);
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

  try {

    let totalQuestions = await prisma.question.count();

    if (totalQuestions >= 250) {

      const oldestQuestion = await prisma.question.findFirst({
        orderBy: {
          id: "asc",
        },
      });

      if (oldestQuestion) {
        await prisma.question.delete({
          where: {
            id: oldestQuestion.id,
          },
        });
      }
    }

    const generated = await generateQuestion(difficulty);

    const savedQuestion = await prisma.question.create({
      data: {
        question: generated.question,

        answer: generated.answer,

        difficulty: generated.difficulty,

        explanation: generated.explanation,
      },
    });

    res.json(savedQuestion);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "AI generation failed",
    });
  }
};

module.exports = {
  createQuestion,
  getQuestions,
  getRandomQuestion,
  checkAnswer,
  generateNewQuestion,
};