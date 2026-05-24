// aiExplainer.js
const OpenAI = require("openai");

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

if (!DEEPSEEK_API_KEY) {
  console.error("❌ DEEPSEEK_API_KEY не задан в переменных окружения!");
  process.exit(1);
}

const client = new OpenAI({
  apiKey: DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com/v1",
});

/**
 * Генерирует пошаговое объяснение математической задачи для школьника.
 * @param {string} question - текст задачи
 * @param {string} answer - правильный ответ
 * @param {string} difficulty - уровень сложности ("easy", "medium", "hard")
 * @returns {Promise<string>} объяснение
 */
async function explainQuestion(question, answer, difficulty) {
  const prompt = `Ты — дружелюбный учитель математики для школьников.
Объясни решение этой задачи просто и понятно, по шагам. 
Пиши на русском языке. Не более 5 строк.

Задача: ${question}
Правильный ответ: ${answer}
Уровень сложности: ${difficulty}

Дай пошаговое объяснение:`;

  const completion = await client.chat.completions.create({
    model: "deepseek-chat",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  return completion.choices[0].message.content.trim();
}

module.exports = { explainQuestion };