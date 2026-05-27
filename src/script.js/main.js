import { generatePasswordWithWord } from './generator.js';
import { generatePassphrase } from './passphraseGenerator.js';
import { copyPassword } from './buttonCopyPassword.js';
import { initModal } from './modalWindow.js';
import { generateQRCode, hideQRCode } from './qrGenerator.js';

initModal();

const passwordOutput = document.getElementById('password-output'),
    generateBtn = document.getElementById('generate-btn'),
    complexityBtns = document.querySelectorAll('.complexity-btn'),
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
    passphraseNumber = document.getElementById('passphrase-number');

let currentLevel = 'low';
let currentLength = 12;

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

complexitySelect.addEventListener('change', (e) => {
    currentLevel = e.target.value;
    updateModalUI(currentLevel);
});

updateModalUI(complexitySelect.value);

function generateAndDisplayPassword() {
    let newPassword = "";

    if (currentLevel === 'passphrase') {
        const wordCount = Number(wordCountInput.value);
        const separator = wordSeparatorInput.value;
        const isCapitalized = passphraseCapitalize.checked;
        const hasNumber = passphraseNumber.checked;
        
        newPassword = generatePassphrase(wordCount, separator, isCapitalized, hasNumber);
        
        complexityBtns.forEach(b => b.classList.remove('active'));
    } else {
        const wordToInclude = customWordInput.value;
        const isRandom = randomToggle.checked;
        
        newPassword = generatePasswordWithWord(currentLevel, currentLength, wordToInclude, isRandom);
    }

    passwordOutput.textContent = newPassword;
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
        updateModalUI(currentLevel);
    });
});

generateBtn.addEventListener('click', () => {
    generateAndDisplayPassword();
    hideQRCode(qrContainer);
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
    currentLength = Number(customLengthInput.value);

    generateAndDisplayPassword();

    const modal = document.getElementById('customize-modal');
    modal.classList.remove('open');
});

qrBtn.addEventListener('click', () => {
    const password = passwordOutput.textContent;
    if (!password) return;
    generateQRCode(password, qrContainer);
});