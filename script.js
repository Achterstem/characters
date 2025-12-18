document.addEventListener('DOMContentLoaded', () => {
    // --- 1. ПЕРЕМЕННЫЕ И ПОИСК ЭЛЕМЕНТОВ ---
    const profileCards = document.querySelectorAll('.profile-card');
    const navItems = document.querySelectorAll('.sidebar nav ul li');
    const players = document.querySelectorAll('.custom-player');

    // --- 2. ВНУТРЕННИЕ ФУНКЦИИ ---

    // Функция для закрашивания дорожек (белый цвет слева)
    function updateSliderFill(slider) {
        if (!slider) return;
        const val = slider.value;
        const min = slider.min || 0;
        const max = slider.max || 100;
        const percent = (val - min) * 100 / (max - min);
        slider.style.backgroundSize = percent + '% 100%';
    }

    // Функция переключения профилей
    function showProfile(targetId) {
        // Останавливаем все аудио при переключении вкладки
        document.querySelectorAll('.audio-element').forEach(audio => {
            audio.pause();
        });

        // Сбрасываем все иконки на Play
        document.querySelectorAll('.icon-play').forEach(i => i.style.display = 'block');
        document.querySelectorAll('.icon-pause').forEach(i => i.style.display = 'none');

        // Скрываем все карточки, показываем целевую
        profileCards.forEach(card => card.style.display = 'none');
        const targetProfile = document.querySelector(targetId);
        if (targetProfile) {
            targetProfile.style.display = 'block';
            // Плавный скролл к контенту на мобилках
            if (window.innerWidth <= 768) {
                document.querySelector('.content').scrollIntoView({ behavior: 'smooth' });
            }
        }
        
        // Обновляем активный пункт меню
        navItems.forEach(item => item.classList.remove('active'));
        const activeLink = document.querySelector(`a[href="${targetId}"]`);
        if (activeLink) {
            activeLink.parentElement.classList.add('active');
        }
    }

    // --- 3. ИНИЦИАЛИЗАЦИЯ ПЛЕЕРОВ ---
    players.forEach(player => {
        const audio = player.querySelector('.audio-element');
        const playBtn = player.querySelector('.play-btn');
        const progress = player.querySelector('.progress-bar');
        const volume = player.querySelector('.volume-slider');
        const iconPlay = playBtn.querySelector('.icon-play');
        const iconPause = playBtn.querySelector('.icon-pause');

        // Установка громкости по умолчанию и закрашивание
        if (volume) {
            audio.volume = volume.value;
            updateSliderFill(volume);
        }

        // Логика кнопки Play/Pause (SVG)
        playBtn.addEventListener('click', () => {
            if (audio.paused) {
                audio.play();
                iconPlay.style.display = 'none';
                iconPause.style.display = 'block';
            } else {
                audio.pause();
                iconPlay.style.display = 'block';
                iconPause.style.display = 'none';
            }
        });

        // Обновление дорожки прогресса во время игры
        audio.addEventListener('timeupdate', () => {
            if (!audio.duration) return;
            const val = (audio.currentTime / audio.duration) * 100;
            progress.value = val;
            updateSliderFill(progress);
        });

        // Ручная перемотка
        progress.addEventListener('input', () => {
            audio.currentTime = (progress.value / 100) * audio.duration;
            updateSliderFill(progress);
        });

        // Регулировка громкости
        volume.addEventListener('input', () => {
            audio.volume = volume.value;
            updateSliderFill(volume);
        });
    });

    // --- 4. НАВИГАЦИЯ ---
    document.querySelectorAll('.sidebar nav ul li a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            showProfile(targetId);
            history.pushState(null, null, targetId);
        });
    });

    window.addEventListener('popstate', () => {
        showProfile(window.location.hash || '#fraud');
    });

    // Установка стартового профиля
    showProfile(window.location.hash || '#fraud');

    // --- 5. МОДАЛЬНОЕ ОКНО (МЕДАЛИ) ---
    const modal = document.getElementById('medalModal');
    if (modal) {
        const modalTitle = document.getElementById('modalTitle');
        const modalId = document.getElementById('modalId');
        const modalDescription = document.getElementById('modalDescription');
        const closeButton = document.querySelector('.close-button');

        document.querySelectorAll('.medal-card').forEach(card => {
            card.addEventListener('click', () => {
                modalTitle.textContent = card.dataset.title;
                modalId.textContent = card.dataset.id;
                modalDescription.textContent = card.dataset.description;
                modal.style.display = 'block';
            });
        });

        if (closeButton) {
            closeButton.onclick = () => modal.style.display = 'none';
        }

        window.onclick = (e) => {
            if (e.target === modal) modal.style.display = 'none';
        };
    }
});

function openGallery(type) {
    const refGallery = document.getElementById('gallery-reference');
    const mainGallery = document.getElementById('gallery-main');

    if (type === 'ref') {
        // Переключаем видимость референсов и скрываем обычную галерею
        refGallery.style.display = (refGallery.style.display === 'none') ? 'block' : 'none';
        mainGallery.style.display = 'none';
    } else {
        // Переключаем видимость галереи и скрываем референсы
        mainGallery.style.display = (mainGallery.style.display === 'none') ? 'block' : 'none';
        refGallery.style.display = 'none';
    }
}
