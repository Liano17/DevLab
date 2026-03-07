function openPreview(title, imgUrl, description) {
    const modal = document.getElementById('previewModal');
    document.getElementById('modalTitle').innerText = title;
    document.getElementById('modalImage').style.backgroundImage = `url('${imgUrl}')`;
    document.getElementById('modalDesc').innerText = description;

    modal.style.display = 'flex';
    // Animação de entrada
    modal.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300 });
    document.body.style.overflow = 'hidden';
}

function closePreview() {
    const modal = document.getElementById('previewModal');
    modal.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200 }).onfinish = () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    };
}

// Fechar com tecla Esc
document.addEventListener('keydown', (e) => {
    if (e.key === "Escape") closePreview();
});