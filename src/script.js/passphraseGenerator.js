import { dictionary } from './dictionary.js';

export function generatePassphrase(wordCount, separator, capitalize, includeNumber) {
    let passphrase = [];
    
    for (let i = 0; i < wordCount; i++) {
        let word = dictionary[Math.floor(Math.random() * dictionary.length)];
        
        if (capitalize) {
            word = word.charAt(0).toUpperCase() + word.slice(1);
        }
        
        passphrase.push(word);
    }

    let finalPassphrase = passphrase.join(separator);

    if (includeNumber) {
        const randomNum = Math.floor(Math.random() * 10);
        finalPassphrase += separator + randomNum;
    }

    return finalPassphrase;
}