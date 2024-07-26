import fs from "fs";
import path from "path";
import validator from "validator";
import readline from "readline";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const dirPath = "./data";
const contactsFile = path.join(dirPath, "contacts.json");

/**
 * Membaca kontak dari file.
 * @returns {Array} Daftar kontak.
 */
const readContacts = () => {
    if (fs.existsSync(contactsFile)) {
        const data = fs.readFileSync(contactsFile, "utf-8");
        return JSON.parse(data);
    }
    return [];
};

/**
 * Menulis kontak ke file.
 * @param {Array} contacts - Daftar kontak yang akan ditulis.
 * @returns {void}
 */
const writeContacts = (contacts) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(contactsFile, JSON.stringify(contacts, null, 2));
};

/**
 * Checks if a contact with the given name already exists.
 * @param {string} name - The name of the contact to check.
 * @returns {boolean} True if the contact exists, false otherwise.
 */
const contactExists = (name) => {
    const contacts = readContacts();
    return contacts.some(
        (contact) => contact.name.toLowerCase() === name.toLowerCase()
    );
};

/**
 * Menambahkan kontak baru.
 * @returns {Promise<void>}
 */
const addContact = async () => {
    const contacts = readContacts(); // Membaca kontak sekali di awal

    const questions = [
        {
            name: "name",
            message: "Masukkan nama:",
            validate: (value) => {
                if (contactExists(value)) {
                    return "Nama kontak sudah ada! Silakan masukkan nama yang berbeda.";
                }
                return true;
            },
        },
        {
            name: "phone",
            message: "Masukkan nomor telepon:",
            validate: (value) => {
                if (validator.isMobilePhone(value, "id-ID")) {
                    return true;
                }
                return "Nomor telepon tidak valid!";
            },
        },
        {
            name: "email",
            message: "Masukkan email:",
            validate: (value) => {
                if (validator.isEmail(value)) {
                    return true;
                }
                return "Email tidak valid!";
            },
        },
    ];

    const getInput = async (question) => {
        return new Promise((resolve) => {
            rl.question(`${question.message} `, (input) => {
                if (question.validate) {
                    const valid = question.validate(input);
                    if (valid === true) {
                        resolve(input.trim());
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

    contacts.push(answers);
    writeContacts(contacts);
    console.log("Kontak berhasil ditambahkan!");

    rl.close();
};

/**
 * Menampilkan semua kontak.
 * @returns {void}
 */
const listContacts = () => {
    const contacts = readContacts();
    if (contacts.length === 0) {
        console.log("Data kosong");
    } else {
        console.log("Daftar Kontak:");
        contacts.forEach((contact, index) => {
            console.log(
                `${index + 1}. Nama: ${contact.name}, Telepon: ${
                    contact.phone
                }, Email: ${contact.email}`
            );
        });
    }
};

/**
 * Menampilkan detail kontak berdasarkan nama.
 * @param {string} name - Nama kontak.
 * @returns {void}
 */
const detailContact = (name) => {
    const contacts = readContacts();
    const contact = contacts.find(
        (c) => c.name.toLowerCase() === name.toLowerCase()
    );
    if (contact) {
        console.log(
            `Detail Kontak: Nama: ${contact.name}, Telepon: ${contact.phone}, Email: ${contact.email}`
        );
    } else {
        console.log(`Kontak dengan nama ${name} tidak ditemukan.`);
    }
};

/**
 * Menghapus kontak berdasarkan nama.
 * @param {string} name - Nama kontak.
 * @returns {void}
 */
const deleteContact = (name) => {
    const contacts = readContacts();
    const newContacts = contacts.filter(
        (c) => c.name.toLowerCase() !== name.toLowerCase()
    );

    if (contacts.length === newContacts.length) {
        console.log(`Kontak dengan nama ${name} tidak ditemukan.`);
    } else {
        writeContacts(newContacts);
        console.log(`Kontak dengan nama ${name} berhasil dihapus.`);
    }
};

/**
 * Memperbarui kontak berdasarkan nama.
 * @returns {Promise<void>}
 */
const updateContact = async () => {
    const contacts = readContacts(); // Membaca kontak sekali di awal

    // Prompt for the contact name to update
    const name = await new Promise((resolve) => {
        rl.question("Masukkan nama kontak yang akan diperbarui: ", (input) => {
            resolve(input.trim());
        });
    });

    const contactIndex = contacts.findIndex(
        (contact) => contact.name.toLowerCase() === name.toLowerCase()
    );

    if (contactIndex === -1) {
        console.log(`Kontak dengan nama ${name} tidak ditemukan.`);
        rl.close();
        return;
    }

    const questions = [
        {
            name: "name",
            message: "Masukkan nama baru (kosongkan untuk tidak mengubah):",
            validate: (value) => {
                if (value && contactExists(value)) {
                    return "Nama kontak sudah ada! Silakan masukkan nama yang berbeda.";
                }
                return true;
            },
        },
        {
            name: "phone",
            message:
                "Masukkan nomor telepon baru (kosongkan untuk tidak mengubah):",
            validate: (value) => {
                if (!value || validator.isMobilePhone(value, "id-ID")) {
                    return true;
                }
                return "Nomor telepon tidak valid!";
            },
        },
        {
            name: "email",
            message: "Masukkan email baru (kosongkan untuk tidak mengubah):",
            validate: (value) => {
                if (!value || validator.isEmail(value)) {
                    return true;
                }
                return "Email tidak valid!";
            },
        },
    ];

    const getInput = async (question) => {
        return new Promise((resolve) => {
            rl.question(`${question.message} `, (input) => {
                if (question.validate) {
                    const valid = question.validate(input);
                    if (valid === true) {
                        resolve(input.trim());
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

    const updatedContact = { ...contacts[contactIndex] };
    for (const question of questions) {
        const answer = await getInput(question);
        if (answer) {
            updatedContact[question.name] = answer;
        }
    }

    contacts[contactIndex] = updatedContact;
    writeContacts(contacts);
    console.log("Kontak berhasil diperbarui!");

    rl.close();
};

// Konfigurasi yargs untuk menangani berbagai perintah
yargs(hideBin(process.argv))
    .version("1.0.2")
    .command("add", "Tambah kontak baru", {}, addContact)
    .command("update", "Perbarui kontak yang ada", {}, updateContact)
    .command("list", "Tampilkan semua kontak", {}, listContacts)
    .command(
        "detail <name>",
        "Tampilkan detail kontak berdasarkan nama",
        (yargs) => {
            yargs.positional("name", {
                describe: "Nama kontak",
                type: "string",
            });
        },
        (argv) => {
            detailContact(argv.name);
        }
    )
    .command(
        "delete <name>",
        "Hapus kontak berdasarkan nama",
        (yargs) => {
            yargs.positional("name", {
                describe: "Nama kontak",
                type: "string",
            });
        },
        (argv) => {
            deleteContact(argv.name);
        }
    )
    .demandCommand(1, "Harap pilih perintah yang valid")
    .help().argv;
