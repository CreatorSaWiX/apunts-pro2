const fs = require('fs');
if (!fs.existsSync('lighthouse-report.json')) {
  console.log("Report not ready");
  process.exit(0);
}
const data = JSON.parse(fs.readFileSync('lighthouse-report.json', 'utf8'));
const scores = {
  performance: data.categories.performance.score * 100,
  accessibility: data.categories.accessibility.score * 100,
  bestPractices: data.categories['best-practices'].score * 100,
  seo: data.categories.seo.score * 100
};
console.log(scores);
