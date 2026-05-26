import { charSets } from './charcters.js';

export function getCharacterPool(level) {
    let charset = '';
    let longPassword = 8;

    switch (level) {

        case 'low':
            charset += charSets.lowercase + charSets.numbers;
            longPassword = 10;
            break;
        case 'medium':
            charset += charSets.lowercase + charSets.uppercase + charSets.numbers;
            longPassword = 16;
            break;
        case 'high':
            charset += charSets.lowercase + charSets.uppercase + charSets.numbers + charSets.symbols;
            longPassword = 20;
            break;
        case 'super':
            charset += charSets.lowercase + charSets.uppercase + charSets.numbers + charSets.symbols + charSets.superSymbols;
            longPassword = 30;
            break;
        default:
            charset += charSets.lowercase;
    }

    let password = '';
    for (let i = 0; i < longPassword; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }

    return password;

}