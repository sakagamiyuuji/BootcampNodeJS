import fs from 'fs';
import validator from 'validator';


const dirPath = './data'; 

// Nama file untuk menyimpan data kontak
const contactsFile = path.join(dirPath, 'contacts.json');

// Fungsi untuk membaca data kontak dari file
const readContacts = () => {
  if (fs.existsSync(contactsFile)) {
    const data = fs.readFileSync(contactsFile);
    return JSON.parse(data);
  }
  return [];
};

// Fungsi untuk menulis data kontak ke file
const writeContacts = (contacts) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  fs.writeFileSync(contactsFile, JSON.stringify(contacts, null, 2));
};

// Fungsi untuk menambah kontak baru
const addContact = async () => {
  const questions = [
    {
      name: 'name',
      type: 'input',
      message: 'Masukkan nama:',
    },
    {
      name: 'phone',
      type: 'input',
      message: 'Masukkan nomor telepon:',
      validate: (value) => {
        if (validator.isMobilePhone(value, 'id-ID')) {
          return true;
        }
        return 'Nomor telepon tidak valid!';
      },
    },
    {
      name: 'email',
      type: 'input',
      message: 'Masukkan email:',
      validate: (value) => {
        if (validator.isEmail(value)) {
          return true;
        }
        return 'Email tidak valid!';
      },
    },
  ];

  // Fungsi untuk meminta input dari pengguna
  const getInput = (question) => {
    return new Promise((resolve, reject) => {
      const { name, message, validate } = question;
      process.stdout.write(`${message} `);
      process.stdin.once('data', (data) => {
        const input = data.toString().trim();
        if (validate) {
          const valid = validate(input);
          if (valid === true) {
            resolve(input);
          } else {
            console.log(valid);
            resolve(getInput(question));
          }
        } else {
          resolve(input);
        }
      });
    });
  };

  const answers = {};
  for (const question of questions) {
    answers[question.name] = await getInput(question);
  }     

  const contacts = readContacts();
  contacts.push(answers);
  writeContacts(contacts);
  console.log('Kontak berhasil ditambahkan!');
};

// Jalankan fungsi untuk menambah kontak baru
addContact().then(() => process.exit());
