document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.sidebar nav ul li a');
    const profileCards = document.querySelectorAll('.profile-card');
    const navItems = document.querySelectorAll('.sidebar nav ul li');

    // --- Функциональность модального окна для медалей (НЕ ИЗМЕНЯЛАСЬ) ---
    const medalCards = document.querySelectorAll('.medal-card');
    const modal = document.getElementById('medalModal');
    const closeButton = document.querySelector('.close-button');
    const modalTitle = document.getElementById('modalTitle');
    const modalId = document.getElementById('modalId');
    const modalDescription = document.getElementById('modalDescription');

    // Устанавливаем обработчики для модального окна только если элементы существуют
    if (modal) {
        medalCards.forEach(card => {
            card.addEventListener('click', () => {
                modalTitle.textContent = card.dataset.title;
                modalId.textContent = card.dataset.id;
                modalDescription.textContent = card.dataset.description;
                modal.style.display = 'block';
            });
        });

        closeButton.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    // --- ЛОГИКА ПЕРЕКЛЮЧЕНИЯ ПРОФИЛЕЙ (ГЛАВНАЯ ЧАСТЬ) ---
    function showProfile(targetId) {
        // 1. Скрываем все профили
        profileCards.forEach(card => {
            card.style.display = 'none';
        });

        // 2. Отображаем целевой профиль
        const targetProfile = document.querySelector(targetId);
        if (targetProfile) {
            targetProfile.style.display = 'block';
            // Прокручиваем страницу вверх, чтобы быть уверенным, что профиль виден
            document.querySelector('.content').scrollIntoView({ behavior: 'smooth' });
        }

        // 3. Обновляем активный элемент в боковом меню
        navItems.forEach(item => {
            item.classList.remove('active');
        });

        const activeLink = document.querySelector(`a[href="${targetId}"]`);
        if (activeLink) {
            activeLink.parentElement.classList.add('active');
        }
    }

    // 4. Устанавливаем начальное состояние при загрузке страницы
    // Получаем ID из URL (например, #walter) или используем #molly по умолчанию
    const initialHash = window.location.hash || '#molly';
    showProfile(initialHash);

    // 5. Обработчик событий для навигационных ссылок
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Предотвращаем стандартный переход (скачок)
            
            const targetId = link.getAttribute('href');
            showProfile(targetId);

            // Обновляем URL в адресной строке (для возможности поделиться ссылкой)
            history.pushState(null, null, targetId);
        });
    });
    
    // 6. Обработчик для кнопок "назад"/"вперед" браузера
    window.addEventListener('popstate', () => {
        const hash = window.location.hash || '#molly';
        showProfile(hash);
    });
});
