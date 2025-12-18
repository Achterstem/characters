document.addEventListener('DOMContentLoaded', () => {
    const profileCards = document.querySelectorAll('.profile-card');
    const navItems = document.querySelectorAll('.sidebar nav ul li');
    const players = document.querySelectorAll('.custom-player');

    // --- 1. ФУНКЦИЯ ОБНОВЛЕНИЯ ЦВЕТА ПОЛЗУНКОВ ---
    function updateSliderFill(slider) {
        const val = slider.value;
        const min = slider.min || 0;
        const max = slider.max || 100;
        const percent = (val - min) * 100 / (max - min);
        // Закрашиваем левую часть ползунка красным
        slider.style.backgroundSize = percent + '% 100%';
    }

    // --- 2. ЛОГИКА ПЕРЕКЛЮЧЕНИЯ ПРОФИЛЕЙ + СТОП МУЗЫКА ---
    function showProfile(targetId) {
        // Остановка всех аудио на странице
        document.querySelectorAll('.audio-element').forEach(audio => {
            audio.pause();
        });
        
        // Сброс всех кнопок на "Play"
        document.querySelectorAll('.play-btn').forEach(btn => {
            btn.textContent = '▶';
            btn.style.fontSize = '22px';
        });

        // Скрываем все карточки и показываем нужную
        profileCards.forEach(card => card.style.display = 'none');
        const targetProfile = document.querySelector(targetId);
        if (targetProfile) {
            targetProfile.style.display = 'block';
            // Прокрутка к контенту для мобильных устройств
            if (window.innerWidth <= 768) {
                document.querySelector('.content').scrollIntoView({ behavior: 'smooth' });
            }
        }
        
        // Обновляем активный пункт в меню
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

        // Устанавливаем начальное закрашивание для громкости
        if (volume) updateSliderFill(volume);

        // Кнопка Play/Pause
        playBtn.addEventListener('click', () => {
            if (audio.paused) {
                audio.play();
                playBtn.textContent = '||'; // Символ паузы
                playBtn.style.fontSize = '16px';
            } else {
                audio.pause();
                playBtn.textContent = '▶';
                playBtn.style.fontSize = '22px';
            }
        });

        // Движение ползунка прогресса при проигрывании
        audio.addEventListener('timeupdate', () => {
            if (!audio.duration) return;
            const val = (audio.currentTime / audio.duration) * 100;
            progress.value = val;
            updateSliderFill(progress);
        });

        // Перемотка
        progress.addEventListener('input', () => {
            audio.currentTime = (progress.value / 100) * audio.duration;
            updateSliderFill(progress);
        });

        // Изменение громкости
        volume.addEventListener('input', () => {
            audio.volume = volume.value;
            updateSliderFill(volume);
        });
    });

    // --- 4. НАВИГАЦИЯ И МОДАЛЬНОЕ ОКНО ---
    
    // Переход по клику в меню
    document.querySelectorAll('.sidebar nav ul li a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            showProfile(targetId);
            history.pushState(null, null, targetId);
        });
    });

    // Обработка кнопки "Назад" в браузере
    window.addEventListener('popstate', () => {
        showProfile(window.location.hash || '#fraud');
    });

    // Установка стартового профиля
    showProfile(window.location.hash || '#fraud');

    // Логика модального окна для медалей
    const modal = document.getElementById('medalModal');
    if (modal) {
        document.querySelectorAll('.medal-card').forEach(card => {
            card.addEventListener('click', () => {
                document.getElementById('modalTitle').textContent = card.dataset.title;
                document.getElementById('modalId').textContent = card.dataset.id;
                document.getElementById('modalDescription').textContent = card.dataset.description;
                modal.style.display = 'block';
            });
        });

        document.querySelector('.close-button').onclick = () => modal.style.display = 'none';
        window.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };
    }
});
