document.addEventListener('DOMContentLoaded', function() {
    // Получение элементов DOM
    const modal = document.getElementById('medalModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalId = document.getElementById('modalId');
    const modalDescription = document.getElementById('modalDescription');
    const closeButton = document.getElementsByClassName('close-button')[0];
    const medalCards = document.querySelectorAll('.medal-card');

    // Функция для открытия модального окна
    function openModal(title, id, description) {
        modalTitle.textContent = title;
        modalId.textContent = id;
        modalDescription.textContent = description;
        modal.style.display = 'block';
    }

    // Функция для закрытия модального окна
    function closeModal() {
        modal.style.display = 'none';
    }

    // Обработчик клика по карточкам медалей
    medalCards.forEach(card => {
        card.addEventListener('click', function() {
            // Получение данных из data-атрибутов
            const title = this.getAttribute('data-title');
            const id = this.getAttribute('data-id');
            const description = this.getAttribute('data-description');
            
            openModal(title, id, description);
        });
    });

    // 1. Закрытие по крестику
    closeButton.onclick = function() {
        closeModal();
    }

    // 2. Закрытие при клике вне модального контента (по свободному пространству)
    window.onclick = function(event) {
        if (event.target == modal) {
            closeModal();
        }
    }
});
