const { generateQuestion } = require('./src/utils/questionGenerator');

console.log("=== BRAINQUEST — ТЕСТ ГЕНЕРАТОРА ===\n");

for (let i = 1; i <= 8; i++) {
  const level = ["easy", "medium", "hard"][
    Math.floor(Math.random() * 3)
  ];

  const q = generateQuestion(level);

  console.log(`Задача ${i}`);
  console.log(`Вопрос: ${q.text}`);
  console.log(`Ответ: ${q.answer}`);
  console.log(`Объяснение: ${q.explanation}`);
  console.log("─".repeat(60));
}