const fs = require('fs');

function readInputSync(question) {
  const buffer = Buffer.alloc(1024);
  fs.writeSync(1, question);
  const bytes = fs.readSync(0, buffer, 0, buffer.length);
  return buffer.toString('utf8', 0, bytes).trim();
}

const name = readInputSync('Siapa nama kamu? ');

const location = readInputSync('Dimana kamu tinggal? ');

console.log(`Nama saya adalah ${name}`);
console.log(`Saya tinggal di ${location}`);