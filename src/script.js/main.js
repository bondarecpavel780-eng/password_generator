import { generatePasswordWithWord } from './generator.js';
import { generatePassphrase } from './passphraseGenerator.js';
import { copyPassword } from './buttonCopyPassword.js';
import { initModal } from './modalWindow.js';
import { generateQRCode, hideQRCode } from './qrGenerator.js';

initModal();

const passwordOutput = document.getElementById('password-output'),
    generateBtn = document.getElementById('generate-btn'),
    complexityBtns = document.querySelectorAll('.complexity-btn'),
    strengthPanel = document.getElementById('password-strength'),
    strengthBar = document.getElementById('strength-bar'),
    strengthLabel = document.getElementById('strength-label'),
    strengthTrack = strengthPanel.querySelector('.strength-track'),
    copyBtn = document.getElementById('copy-btn'),
    toast = document.getElementById('copy-toast'),
    applyBtn = document.getElementById('apply-settings-btn'),
    qrBtn = document.getElementById('qr-btn'),
    qrContainer = document.getElementById('qr-container'),
    customWordInput = document.getElementById('custom-word'),
    randomToggle = document.getElementById('random-toggle'),
    complexitySelect = document.getElementById('custom-complexity'),
    passwordOnlyGroup = document.getElementById('password-only-group'),
    passphraseGroup = document.getElementById('passphrase-ui-group'),
    randomPlacementWrapper = document.getElementById('random-placement-wrapper'),
    passphraseToggles = document.getElementById('passphrase-toggles'),
    wordCountInput = document.getElementById('word-count'),
    wordSeparatorInput = document.getElementById('word-separator'),
    customLengthInput = document.getElementById('custom-length'),
    passphraseCapitalize = document.getElementById('passphrase-capitalize'),
    passphraseNumber = document.getElementById('passphrase-number'),
    passphraseCustomWords = document.getElementById('passphrase-custom-words'),
    passphraseRandomToggle = document.getElementById('passphrase-random-toggle');

let currentLevel = 'low';
let currentLength = 10;

const DEFAULT_LENGTHS = {
    low: 10,
    medium: 16,
    high: 20,
    super: 30,
    numbers: 10,
    'small letters': 12,
    'large letters': 12
};

function syncDefaultLength(level) {
    if (DEFAULT_LENGTHS[level]) {
        currentLength = DEFAULT_LENGTHS[level];
        if (customLengthInput) {
            customLengthInput.value = currentLength;
        }
    }
}

function updateModalUI(level) {
    if (level === 'passphrase') {
        passwordOnlyGroup.classList.add('hidden-ui');
        randomPlacementWrapper.classList.add('hidden-ui');
        passphraseGroup.classList.remove('hidden-ui');
        passphraseToggles.classList.remove('hidden-ui');
    } else {
        passwordOnlyGroup.classList.remove('hidden-ui');
        randomPlacementWrapper.classList.remove('hidden-ui');
        passphraseGroup.classList.add('hidden-ui');
        passphraseToggles.classList.add('hidden-ui');
    }
}

function checkPasswordStrength(password) {
    const length = password.length;
    const isOnlyDigits = /^\d+$/.test(password);
    const isOnlyLowercase = /^[a-z]+$/.test(password);
    const isOnlyUppercase = /^[A-Z]+$/.test(password);

    if (isOnlyDigits || isOnlyLowercase || isOnlyUppercase) {
        const percent = Math.min(100, length <= 10 ? length * 1.5 : 15 + (length - 10) * 3.2);
        const roundedPercent = Number(percent.toFixed(1));
        const status = roundedPercent <= 25
            ? 'Low'
            : roundedPercent <= 50
                ? 'Medium'
                : roundedPercent <= 75
                    ? 'High'
                    : 'Super';

        return { percent: roundedPercent, status };
    }

    const uppercaseCount = (password.match(/[A-Z]/g) || []).length;
    const digitCount = (password.match(/\d/g) || []).length;
    const specialCharacterCount = (password.match(/[^A-Za-z0-9]/g) || []).length;
    const firstTenCharactersScore = Math.min(length, 10);
    const additionalCharactersScore = Math.max(length - 10, 0) * 2;
    const percent = Math.min(
        100,
        firstTenCharactersScore
                + additionalCharactersScore
                + uppercaseCount * 2
                + digitCount * 4
                + specialCharacterCount * 7
    );
    const status = percent <= 25
        ? 'Low'
        : percent <= 50
            ? 'Medium'
            : percent <= 75
                ? 'High'
                : 'Super';

    return { percent, status };
}

function updatePasswordStrength(password) {
    const { percent, status } = checkPasswordStrength(password);

    strengthPanel.hidden = false;
    strengthBar.style.width = `${percent}%`;
    strengthBar.className = `strength-bar strength-${Math.max(1, Math.ceil(percent / 20))}`;
    strengthLabel.textContent = `${status} (${percent}%)`;
    strengthTrack.setAttribute('aria-valuenow', percent);
    strengthTrack.setAttribute('aria-valuetext', `${status}, ${percent}%`);
}

complexitySelect.addEventListener('change', (e) => {
    currentLevel = e.target.value;
    syncDefaultLength(currentLevel);
    updateModalUI(currentLevel);
});

// Initialize consistent state on page load
complexitySelect.value = currentLevel;
syncDefaultLength(currentLevel);
updateModalUI(currentLevel);

function generateAndDisplayPassword() {
    let newPassword = "";
    hideQRCode(qrContainer);

    if (currentLevel === 'passphrase') {
        let wordCount = Number(wordCountInput.value);
        if (isNaN(wordCount) || wordCount < 2) wordCount = 2;
        if (wordCount > 10) wordCount = 10;
        wordCountInput.value = wordCount;

        const separator = wordSeparatorInput.value;
        const isCapitalized = passphraseCapitalize.checked;
        const hasNumber = passphraseNumber.checked;
        const customWords = passphraseCustomWords.value;
        const shuffleWords = passphraseRandomToggle.checked;
        
        newPassword = generatePassphrase(wordCount, separator, isCapitalized, hasNumber, customWords, shuffleWords);
        
        complexityBtns.forEach(b => b.classList.remove('active'));
    } else {
        let length = Number(customLengthInput.value);
        if (isNaN(length) || length < 4) length = 4;
        customLengthInput.value = length;
        currentLength = length;

        const wordToInclude = customWordInput.value;
        const isRandom = randomToggle.checked;
        
        newPassword = generatePasswordWithWord(currentLevel, currentLength, wordToInclude, isRandom);
    }

    passwordOutput.textContent = newPassword;
    updatePasswordStrength(newPassword);
    copyBtn.style.display = 'inline-block';
    qrBtn.style.display = 'inline-block';
}

complexityBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        complexityBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');

        currentLevel = e.target.dataset.level;
        if (complexitySelect) {
            complexitySelect.value = currentLevel;
        }
        syncDefaultLength(currentLevel);
        updateModalUI(currentLevel);
    });
});

generateBtn.addEventListener('click', () => {
    generateAndDisplayPassword();
});

copyBtn.addEventListener('click', () => {
    const password = passwordOutput.textContent;
    copyPassword(password);
    
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 1000);
});

applyBtn.addEventListener('click', () => {
    currentLevel = complexitySelect.value;
    
    complexityBtns.forEach(btn => {
        if (btn.dataset.level === currentLevel) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    generateAndDisplayPassword();

    const modal = document.getElementById('customize-modal');
    modal.classList.remove('open');
});

qrBtn.addEventListener('click', () => {
    const password = passwordOutput.textContent;
    if (!password || password === "Here will be your password...") return;
    generateQRCode(password, qrContainer);
});