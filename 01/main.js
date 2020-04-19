const invoice = require('./invoices.json');
const plays = require('./plays.json');

function amountFor(perf, play) {
  let thisAmount = 0;
  switch (play.type) {
    case 'tragedy': // 비극
      thisAmount = 40000;
      if (perf.audience < 30) {
        thisAmount += 1000 * (perf.audience - 30);
      }
      break;
    case 'comedy': // 희극
      thisAmount = 30000;
      if (perf.audience < 20) {
        thisAmount += 10000 + 500 * (perf.audience - 20);
      }
      break;
    default:
      throw new Error(`알 수 없는 장르 : ${play.type}`);
  }
  return thisAmount;
}

function statement(invoice, plays) {
  let totoalAmount = 0;
  let volumeCredits = 0;
  let result = `청구 내역 (고객명 : ${invoice.customer})\n`;
  const format = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format;

  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    let thisAmount = amountFor(perf, play);

    // 포인트를 적립한다.
    volumeCredits += Math.max(perf.audience - 30, 0);

    // 희극 관객 5명마다 추가 포인트르 제공한다.
    if ('comedy' === play.type) {
      volumeCredits += Math.floor(perf.audience / 5);
    }
    result += `  ${play.name}: ${format(thisAmount / 100)}, (${
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
