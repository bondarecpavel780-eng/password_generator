export function initModal(){
    const modal = document.getElementById('customize-btn'),
        modalContent = document.getElementById('customize-modal'),
        closeBtn = document.getElementById('close-modal-btn');

    modal.addEventListener('click', () => {
        modalContent.classList.add('open');
    });

    closeBtn.addEventListener('click', () => {
        modalContent.classList.remove('open');
    });

}