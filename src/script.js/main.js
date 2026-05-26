import {getCharacterPool} from './generator.js';
import {copyPassword} from './buttonCopyPassword.js';
import {initModal}  from './modalWindow.js';
import { generateQRCode, hideQRCode } from './qrGenerator.js';

initModal();

const passwordOutput = document.getElementById('password-output'),
    generateBtn = document.getElementById('generate-btn'),
    complexityBtns = document.querySelectorAll('.complexity-btn'),
    copyBtn = document.getElementById('copy-btn'),
    toast = document.getElementById('copy-toast'),
    applyBtn = document.getElementById('apply-settings-btn'),
    qrBtn = document.getElementById('qr-btn'),
    qrContainer = document.getElementById('qr-container');

let currentLevel = 'low';
let currentLength = null;

complexityBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        complexityBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        
        currentLevel = e.target.dataset.level;
    });
});

generateBtn.addEventListener('click', () => {
    const newPassword = getCharacterPool(currentLevel, currentLength);
    passwordOutput.textContent = newPassword;

    copyBtn.style.display = 'inline-block';
    qrBtn.style.display = 'inline-block';
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
    const lengthValue = document.getElementById('custom-length').value;
    const complexityValue = document.getElementById('custom-complexity').value;

    currentLength = Number(lengthValue);
    currentLevel = complexityValue;

    const newPassword = getCharacterPool(currentLevel, currentLength);
    passwordOutput.textContent = newPassword;

    copyBtn.style.display = 'inline-block';
    qrBtn.style.display = 'inline-block';

    const modal = document.getElementById('customize-modal');
    modal.classList.remove('open');
});

qrBtn.addEventListener('click', () => {
    const password = passwordOutput.textContent;

    if (!password) return; 
    
    generateQRCode(password, qrContainer);
});

generateBtn.addEventListener('click', () => {
    const newPassword = getCharacterPool(currentLevel, currentLength);
    passwordOutput.textContent = newPassword;
    
    copyBtn.style.display = 'inline-block';
    qrBtn.style.display = 'inline-block';

    hideQRCode(qrContainer);
});