const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let answers = {};

rl.question('Siapa nama kamu? ', (name) => {
  answers.name = name;

//   console.log(`Nama saya adalah ${answers.name}`);

  rl.question('Dimana kamu tinggal? ', (location) => {
    answers.location = location;

    // console.log(`Saya tinggal di ${answers.location}`);

        rl.question(`Email kamu apa ${name}? `, (email) => {
            answers.email = email;

            // console.log(`Email ${answers.email}`);

            console.log('\n');
            console.log(`Nama saya adalah ${answers.name}`);
            console.log(`Saya tinggal di ${answers.location}`);
            console.log(`Email ${answers.email}`);

            rl.close();
        });
    });
});