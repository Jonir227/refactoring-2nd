const invoice = require('./invoices.json');
const plays = require('./plays.json');

function playFor(aPerformance) {
  return plays[aPerformance.playID];
}

function amountFor(aPerformance) {
  let result = 0;
  switch (playFor(aPerformance).type) {
    case 'tragedy': // 비극
      result = 40000;
      if (aPerformance.audience < 30) {
        result += 1000 * (aPerformance.audience - 30);
      }
      break;
    case 'comedy': // 희극
      result = 30000;
      if (aPerformance.audience < 20) {
        result += 10000 + 500 * (aPerformance.audience - 20);
      }
      break;
    default:
      throw new Error(`알 수 없는 장르 : ${playFor(perf).type}`);
  }
  return result;
}

function statement(invoice) {
  let totoalAmount = 0;
  let volumeCredits = 0;
  let result = `청구 내역 (고객명 : ${invoice.customer})\n`;
  const format = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format;

  for (let perf of invoice.performances) {
    let thisAmount = amountFor(perf, playFor(perf));

    // 포인트를 적립한다.
    volumeCredits += Math.max(perf.audience - 30, 0);

    // 희극 관객 5명마다 추가 포인트르 제공한다.
    if ('comedy' === playFor(perf).type) {
      volumeCredits += Math.floor(perf.audience / 5);
    }
    result += `  ${playFor(perf).name}: ${format(thisAmount / 100)}, (${
      perf.audience
    } 석)\n`;
  }

  result += `총액: ${format(totoalAmount / 100)}\n`;
  result += `적립 포인트: ${volumeCredits}점\n`;
  return result;
}

console.log(
  statement(invoice, plays).includes(
    `청구 내역 (고객명 : BingCo)
  Hamlet: $400.00, (55 석)
  As You Like It: $300.00, (35 석)
  Othello: $400.00, (40 석)
총액: $0.00
적립 포인트: 47점`
  )
);
console.log(statement(invoice, plays));
