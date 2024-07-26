import yargs from "yargs";
import { hideBin } from "yargs/helpers";

const argv = yargs(hideBin(process.argv))
    .command({
        command: "add",
        describe: "add new contact",
        builder: {
            name: {
                describe: "Contact Name",
                demandOption: true,
                type: "string",
            },
            email: {
                describe: "Contact Email",
                demandOption: true,
                type: "string",
            },
            phone: {
                describe: "Contact Phone",
                demandOption: true,
                type: "string",
            },
        },
        handler(argv) {
            const contact = {
                name: argv.name,
                email: argv.email,
                phone: argv.phone,
            };
            console.log(contact);
        },
    })
    .help().argv;
