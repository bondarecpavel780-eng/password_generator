import { dictionary } from './dictionary.js';

export function generatePassphrase(wordCount, separator, capitalize, includeNumber, customWordsString, shuffleWords) {
    let chosenWords = [];
    
    let customWords = [];
    if (customWordsString && customWordsString.trim()) {
        customWords = customWordsString.split(/\s+/).filter(w => w.trim().length > 0);
    }
    
    if (customWords.length > 0) {
        if (customWords.length >= wordCount) {
            let tempCustom = [...customWords];
            for (let i = 0; i < wordCount; i++) {
                const idx = Math.floor(Math.random() * tempCustom.length);
                chosenWords.push(tempCustom.splice(idx, 1)[0]);
            }
        } else {
            chosenWords = [...customWords];
            const remainingCount = wordCount - chosenWords.length;
            for (let i = 0; i < remainingCount; i++) {
                const randomWord = dictionary[Math.floor(Math.random() * dictionary.length)];
                chosenWords.push(randomWord);
            }
        }
    } else {
        for (let i = 0; i < wordCount; i++) {
            const randomWord = dictionary[Math.floor(Math.random() * dictionary.length)];
            chosenWords.push(randomWord);
        }
    }
    
    chosenWords = chosenWords.map(word => {
        if (capitalize) {
            return word.charAt(0).toUpperCase() + word.slice(1);
        }
        return word;
    });
    
    if (shuffleWords) {
        for (let i = chosenWords.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [chosenWords[i], chosenWords[j]] = [chosenWords[j], chosenWords[i]];
        }
    }
    
    let finalPassphrase = chosenWords.join(separator);

    if (includeNumber) {
        const randomNum = Math.floor(Math.random() * 10);
        finalPassphrase += separator + randomNum;
    }

    return finalPassphrase;
}