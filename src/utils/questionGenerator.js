function generateQuestion(level) {
    let q;
  
    switch (level) {
      case "easy":
        q = generateLevel1();
        break;
  
      case "medium":
        q =
          Math.random() > 0.5
            ? generateLevel2()
            : generateLevel3();
        break;
  
      case "hard":
        q =
          Math.random() > 0.5
            ? generateLevel4()
            : generateLevel5();
        break;
  
      default:
        q = generateLevel1();
    }
  
    q.explanation = makeFriendlyExplanation(q);
  
    return q;
  }
  
  // ==================== EASY ====================
  
  function generateLevel1() {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
  
    if (Math.random() > 0.5) {
      return {
        text: `${a} + ${b} = ?`,
        answer: a + b,
        topic: "Сложение",
        type: "addition",
        a,
        b,
      };
    } else {
      const x = Math.max(a, b);
      const y = Math.min(a, b);
  
      return {
        text: `${x} - ${y} = ?`,
        answer: x - y,
        topic: "Вычитание",
        type: "subtraction",
        a: x,
        b: y,
      };
    }
  }
  
  // ==================== MEDIUM ====================
  
  function generateLevel2() {
    const a = Math.floor(Math.random() * 12) + 3;
    const b = Math.floor(Math.random() * 5) + 2;
  
    return {
      text: `${a} × ${b} = ?`,
      answer: a * b,
      topic: "Умножение",
      type: "multiplication",
      a,
      b,
    };
  }
  
  function generateLevel3() {
    if (Math.random() > 0.5) {
      const a = Math.floor(Math.random() * 15) + 1;
      const b = a + Math.floor(Math.random() * 25) + 5;
      const x = b - a;
  
      return {
        text: `x + ${a} = ${b}\nНайдите x.`,
        answer: x,
        topic: "Линейные уравнения",
        type: "linear_eq_add",
        a,
        b,
      };
    } else {
      const a = Math.floor(Math.random() * 8) + 2;
      const x = Math.floor(Math.random() * 12) + 3;
      const b = a * x;
  
      return {
        text: `${a}x = ${b}\nНайдите x.`,
        answer: x,
        topic: "Линейные уравнения",
        type: "linear_eq_mult",
        a,
        b,
      };
    }
  }
  
  // ==================== HARD ====================
  
  function generateLevel4() {
    const a = Math.floor(Math.random() * 5) + 2;
    const b = Math.floor(Math.random() * 10) + 1;
    const c = Math.floor(Math.random() * 30) + 20;
  
    const answer = Math.floor((c - b) / a);
  
    return {
      text: `${a}x + ${b} = ${c}\nНайдите x.`,
      answer,
      topic: "Двухшаговые уравнения",
      type: "two_step",
      a,
      b,
      c,
    };
  }
  
  function generateLevel5() {
    const roots = [
      [1, 6],
      [2, 3],
      [2, 4],
      [1, 5],
      [3, 4],
      [1, 7],
      [-1, 5],
      [-2, 6],
      [3, 5],
    ];
  
    const [r1, r2] =
      roots[Math.floor(Math.random() * roots.length)];
  
    const b = -(r1 + r2);
    const c = r1 * r2;
  
    return {
      text: `x² ${b >= 0 ? "+" : ""}${b}x ${
        c >= 0 ? "+" : ""
      }${c} = 0\nНайдите корни.`,
      answer: [r1, r2],
      topic: "Квадратные уравнения",
      type: "quadratic",
    };
  }
  
  // ==================== EXPLANATIONS ====================
  
  function makeFriendlyExplanation(q) {
    switch (q.type) {
      case "addition":
        return `Складываем ${q.a} и ${q.b} и получаем ${q.answer}.`;
  
      case "subtraction":
        return `Вычитаем ${q.b} из ${q.a} и получаем ${q.answer}.`;
  
      case "multiplication":
        return `Умножаем ${q.a} на ${q.b} и получаем ${q.answer}.`;
  
      case "linear_eq_add":
        return `${q.b} - ${q.a} = ${q.answer}.`;
  
      case "linear_eq_mult":
        return `${q.b} ÷ ${q.a} = ${q.answer}.`;
  
      case "two_step":
        return `Сначала вычитаем ${q.b}, потом делим на ${q.a}. Получаем ${q.answer}.`;
  
      case "quadratic":
        return `Корни уравнения: ${q.answer[0]} и ${q.answer[1]}.`;
  
      default:
        return `Правильный ответ — ${q.answer}.`;
    }
  }
  
  module.exports = {
    generateQuestion,
  };