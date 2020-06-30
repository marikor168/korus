// invoices.json
const invoice = {
  "customer": "MDT",
  "performance": [
    {
      "playId": "Гамлет",
      "audience": 55,
      "type": "tragedy"
    },
    {
      "playId": "Ромео и Джульетта",
      "audience": 35,
      "type": "tragedy"
    },
    {
      "playId": "Отелло",
      "audience": 40,
      "type": "comedy"
    },
  ]
};
  
function statement(invoice) {
  const plays = invoice.performance;
  let totalAmount = 0;
  let volumeCredits = 0;

  let result = `Счет для ${invoice.customer}\n`;

  for (let play of plays) {
    let thisAmount = countAmount(play);
    volumeCredits = countCredits(volumeCredits, play);
    result += ` ${play.playId}: ${format(thisAmount)}`;
    result += ` (${play.audience} мест)\n`;
    totalAmount += thisAmount;
  }

  volumeCredits += countComedyCredits(plays);
  result += `Итого с вас ${format(totalAmount)}\n`;
  result += `Вы заработали ${volumeCredits} бонусов\n`;
  return result;
}

function format(number) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency", 
    currency: "RUB",
    minimumFractionDigits: 2 
  }).format(number);
}

function countCredits(volumeCredits, play) {
  return volumeCredits + Math.max(play.audience - 30, 0);
}

function countComedyCredits(plays) {
  // Дополнительный бонус за каждые 10 комедий
  let comedies = plays.filter(p => p.type === "comedy");
  if (comedies.length < 10) return 0;

  let comedyCredits = 0;
  let tenComedies = Math.floor(comedies.length / 10);
  for (let i = 0; i < tenComedies * 10; i++) {
    let play = comedies[i];
    comedyCredits += Math.floor(play.audience / 5);
  }
  return comedyCredits;
}

function countAmount(play) {
  let thisAmount = 0;

  switch (play.type) {
    case "tragedy":
      thisAmount = 40000;
      if (play.audience > 30) {
        thisAmount += 1000 * (play.audience - 30);
      }
      break;
    case "comedy":
      thisAmount = 30000;
      if (play.audience > 20) {
        thisAmount += 10000 + 500 * (play.audience - 20);
      }
      thisAmount += 300 * play.audience;
      break;
    default:
      throw new Error(`неизвестный тип: ${play.type}`);
  }

  return thisAmount;
}

console.log(statement(invoice));