

document.querySelectorAll('.pc-parts-list a').forEach((item) => {
    item.addEventListener('mouseenter', () => {
        const hoverBox = document.querySelector('.hover-box');
        hoverBox.style.display = 'block';
        hoverBox.style.top = `${item.offsetTop}px`;
    });

    item.addEventListener('mouseleave', () => {
        const hoverBox = document.querySelector('.hover-box');
        hoverBox.style.display = 'block';
    });
});