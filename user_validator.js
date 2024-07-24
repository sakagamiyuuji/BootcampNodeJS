import readlineSync from 'readline-sync';
import validator from 'validator';
import chalk from 'chalk';

// Function to ask user for input and validate email and phone
async function getUserDetails() {
    const name = readlineSync.question('Enter your name: ');

    let email = readlineSync.question('Enter your email: ');
    while (!validator.isEmail(email)) {
        console.log(chalk.red('Invalid email format. Please enter a valid email.'));
        email = readlineSync.question('Enter your email: ');
    }

    const { default: validatorPhone } = await import('validator-ponsel');
    
    let phone = readlineSync.question('Enter your phone number: ');
    while (!validatorPhone(phone, 'any')) {
        console.log(chalk.blue('Invalid phone number. Please enter a valid phone number.'));
        phone = readlineSync.question('Enter your phone number: ');
    }

    return { name, email, phone };
}

getUserDetails().then(userDetails => {
    console.log('User Details:', userDetails);
}).catch(error => {
    console.error('Error getting user details:', error);
});
