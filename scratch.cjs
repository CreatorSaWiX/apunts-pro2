const fs = require('fs');
const path = require('path');
const dir = 'c:/Users/jiaha/Documents/GEI/apunts-pro2/public/data/subjects';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
let htmls = [];
files.slice(0, 10).forEach(f => {
  const data = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf-8'));
  const evalSec = data.sections.find(s => s.title === "Mètode d'avaluació");
  if (evalSec) htmls.push({file: f, html: evalSec.html});
});
console.log(JSON.stringify(htmls, null, 2));
