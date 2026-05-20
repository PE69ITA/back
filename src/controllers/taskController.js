const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const createTask = async (req, res) => {
  const { title } = req.body;

  const task = await prisma.task.create({
    data: {
      title,
      userId: req.userId,
    },
  });

  res.json(task);
};

const getTasks = async (req, res) => {
  const tasks = await prisma.task.findMany({
    where: {
      userId: req.userId,
    },
  });

  res.json(tasks);
};

module.exports = {
  createTask,
  getTasks,
};