const OpenAI = require("openai");

const DEEPSEEK_API_KEY = "sk-646fcb37b9a94222bfd90991c1471913";

if (!DEEPSEEK_API_KEY) {
  console.error("❌ DEEPSEEK_API_KEY не задан!");
  process.exit(1);
}

const client = new OpenAI({
  apiKey: DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com/v1",
});

const DIFFICULTY_CONTEXT = {
  easy: {
    grade: "1 класс (6-7 лет)",
    topics: "сложение и вычитание чисел от 1 до 20",
    example:
      '{"question":"5 + 3 = ?","answer":"8","difficulty":"easy","explanation":"Шаг 1: У тебя есть 5 яблок. Шаг 2: Добавь ещё 3 яблока. Шаг 3: Посчитай все яблоки: 5, 6, 7, 8. Ответ: 8"}',
  },

  medium: {
    grade: "2-3 класс (8-9 лет)",
    topics:
      "сложение и вычитание двузначных чисел, таблица умножения, деление",

    example:
      '{"question":"24 + 15 = ?","answer":"39","difficulty":"medium","explanation":"Шаг 1: Сложи единицы: 4 + 5 = 9. Шаг 2: Сложи десятки: 20 + 10 = 30. Шаг 3: Сложи результаты: 30 + 9 = 39. Ответ: 39"}',
  },

  hard: {
    grade: "3-4 класс (9-10 лет)",

    topics:
      "умножение и деление трёхзначных чисел, задачи на несколько действий, дроби",

    example:
      '{"question":"Маша купила 3 тетради по 12 рублей каждая. Сколько она заплатила?","answer":"36","difficulty":"hard","explanation":"Шаг 1: Узнаем цену одной тетради: 12 рублей. Шаг 2: Умножим цену на количество: 12 × 3 = 36. Ответ: 36"}',
  },
};

function buildPrompt(difficulty) {
  const ctx = DIFFICULTY_CONTEXT[difficulty];

  return `Придумай одну математическую задачу для ученика ${ctx.grade}.
Тема: ${ctx.topics}.

Верни ТОЛЬКО JSON без markdown и без лишнего текста.

Формат:
{
  "question": "текст задачи",
  "answer": "ответ числом или строкой",
  "difficulty": "${difficulty}",
  "explanation": "Шаг 1: ... Шаг 2: ... Шаг 3: ... Ответ: ..."
}

Правила:
- Простые слова, понятные ребёнку
- Максимум 3 шага
- Без эмодзи
- На русском языке

Пример:
${ctx.example}`;
}

async function generateQuestion(difficulty = "easy") {
  const completion = await client.chat.completions.create({
    model: "deepseek-chat",

    messages: [
      {
        role: "user",
        content: buildPrompt(difficulty),
      },
    ],

    temperature: 0.8,

    response_format: {
      type: "json_object",
    },
  });

  const raw = completion.choices[0].message.content;

  const parsed = JSON.parse(raw);

  const required = [
    "question",
    "answer",
    "difficulty",
    "explanation",
  ];

  for (const field of required) {
    if (!parsed[field]) {
      throw new Error(`Missing field: ${field}`);
    }
  }

  parsed.answer = String(parsed.answer);

  return parsed;
}

module.exports = {
  generateQuestion,
};