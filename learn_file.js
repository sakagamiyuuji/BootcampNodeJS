
const fs = require('fs');
// fs.writeFileSync('test.txt', 'Hello World!!');

// const content = fs.readFileSync('test.txt'); //sync
// console.log(content.toString())

fs.readFile('test.txt', (err, data) => {
    if (err) throw err;
    console.log(data.toString());
  });