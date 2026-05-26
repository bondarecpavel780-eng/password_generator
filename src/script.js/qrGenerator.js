export function generateQRCode(password, container) {
    container.innerHTML = ''; 

    new QRCode(container, {
        text: password,
        width: 150,
        height: 150,
        colorDark : "#2c3e50",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });

    container.classList.add('show');
}

export function hideQRCode(container) {
    container.classList.remove('show');
}