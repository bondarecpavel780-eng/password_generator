import {getCharacterPool} from './generator.js';
import {copyPassword} from './buttonCopyPassword.js';

const passwordOutput = document.getElementById('password-output'),
    generateBtn = document.getElementById('generate-btn'),
    complexityBtns = document.querySelectorAll('.complexity-btn'),
    copyBtn = document.getElementById('copy-btn'),
    toast = document.getElementById('copy-toast');

let currentLevel = 'low'; 

complexityBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        complexityBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        
        currentLevel = e.target.dataset.level;
    });
});

generateBtn.addEventListener('click', () => {
    const newPassword = getCharacterPool(currentLevel);
    passwordOutput.textContent = newPassword;

    copyBtn.style.display = 'inline-block';
});

copyBtn.addEventListener('click', () => {
    const password = passwordOutput.textContent;
    copyPassword(password);
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 1000);
});

