import { charSets } from './charcters.js';

export function getCharacterPool(level, customLength) {
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
        case 'numbers':
            charset += charSets.numbers;
            longPassword = 10;
            break;
        case 'small letters':
            charset += charSets.lowercase;
            longPassword = 12;
            break;
        case 'large letters':
            charset += charSets.uppercase;
            longPassword = 12;
            break;
        default:
            charset += charSets.lowercase;
    }

    if (customLength) {
        longPassword = customLength;
    }

    let password = '';
    for (let i = 0; i < longPassword; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }

    return password;
}

export function generatePasswordWithWord(currentLevel, currentLength, wordToInclude, isRandom) {
    let newPassword = "";

    if (wordToInclude) {
        const remainingLength = currentLength - wordToInclude.length;
        let fillerChars = "";
        
        if (remainingLength > 0) {
            fillerChars = getCharacterPool(currentLevel, remainingLength);
        }

        const safeWord = wordToInclude.slice(0, currentLength);
        const safeFiller = fillerChars.slice(0, currentLength - safeWord.length);

        if (isRandom) {
            let combinedArray = (safeWord + safeFiller).split('');
            for (let i = combinedArray.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [combinedArray[i], combinedArray[j]] = [combinedArray[j], combinedArray[i]];
            }
            newPassword = combinedArray.join('');
        } else {
            newPassword = safeWord + safeFiller;
        }
    } else {
        newPassword = getCharacterPool(currentLevel, currentLength);
    }

    return newPassword;
}