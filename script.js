document.addEventListener('DOMContentLoaded', () => {
    const profileCards = document.querySelectorAll('.profile-card');
    const navItems = document.querySelectorAll('.sidebar nav ul li');
    const players = document.querySelectorAll('.custom-player');

    function updateSliderFill(slider) {
        if (!slider) return;
        const val = slider.value;
        const min = slider.min || 0;
        const max = slider.max || 100;
        const percent = (val - min) * 100 / (max - min);
        slider.style.backgroundSize = percent + '% 100%';
    }

    function showProfile(targetId) {
        document.querySelectorAll('.audio-element').forEach(audio => {
            audio.pause();
        });

        document.querySelectorAll('.icon-play').forEach(i => i.style.display = 'block');
        document.querySelectorAll('.icon-pause').forEach(i => i.style.display = 'none');

        profileCards.forEach(card => card.style.display = 'none');
        const targetProfile = document.querySelector(targetId);
        if (targetProfile) {
            targetProfile.style.display = 'block';
            if (window.innerWidth <= 768) {
                document.querySelector('.content').scrollIntoView({ behavior: 'smooth' });
            }
        }
        
        navItems.forEach(item => item.classList.remove('active'));
        const activeLink = document.querySelector(`a[href="${targetId}"]`);
        if (activeLink) {
            activeLink.parentElement.classList.add('active');
        }
    }

    players.forEach(player => {
        const audio = player.querySelector('.audio-element');
        const playBtn = player.querySelector('.play-btn');
        const progress = player.querySelector('.progress-bar');
        const volume = player.querySelector('.volume-slider');
        const iconPlay = playBtn.querySelector('.icon-play');
        const iconPause = playBtn.querySelector('.icon-pause');

        if (volume) {
            audio.volume = volume.value;
            updateSliderFill(volume);
        }

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

        audio.addEventListener('timeupdate', () => {
            if (!audio.duration) return;
            const val = (audio.currentTime / audio.duration) * 100;
            progress.value = val;
            updateSliderFill(progress);
        });

        progress.addEventListener('input', () => {
            audio.currentTime = (progress.value / 100) * audio.duration;
            updateSliderFill(progress);
        });

        volume.addEventListener('input', () => {
            audio.volume = volume.value;
            updateSliderFill(volume);
        });
    });

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

    showProfile(window.location.hash || '#fraud');

    profileCards.forEach(card => {
        const btnRef = card.querySelector('.btn-ref');
        const btnGal = card.querySelector('.btn-gal');
        const refGal = card.querySelector('.ref-gallery');
        const mainGal = card.querySelector('.main-gallery');

        if (btnRef && refGal) {
            btnRef.addEventListener('click', () => {
                refGal.style.display = (refGal.style.display === 'none') ? 'block' : 'none';
                if (mainGal) mainGal.style.display = 'none';
            });
        }

        if (btnGal && mainGal) {
            btnGal.addEventListener('click', () => {
                mainGal.style.display = (mainGal.style.display === 'none') ? 'block' : 'none';
                if (refGal) refGal.style.display = 'none';
            });
        }
    });

    const imageModal = document.getElementById('imageModal');
    const fullImage = document.getElementById('fullScreenImage');
    const closeViewer = document.querySelector('.close-viewer');

    if (imageModal) {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('gallery-thumb')) {
                fullImage.src = e.target.src;
                imageModal.style.display = 'flex';
            }
        });

        if (closeViewer) {
            closeViewer.onclick = () => imageModal.style.display = 'none';
        }

        imageModal.onclick = (e) => {
            if (e.target === imageModal) imageModal.style.display = 'none';
        };
    }

    const medalModal = document.getElementById('medalModal');
    if (medalModal) {
        const modalTitle = document.getElementById('modalTitle');
        const modalId = document.getElementById('modalId');
        const modalDescription = document.getElementById('modalDescription');
        const closeMedal = document.querySelector('.close-button');

        document.querySelectorAll('.medal-card').forEach(card => {
            card.addEventListener('click', () => {
                modalTitle.textContent = card.dataset.title;
                modalId.textContent = card.dataset.id;
                modalDescription.textContent = card.dataset.description;
                medalModal.style.display = 'block';
            });
        });

        if (closeMedal) {
            closeMedal.onclick = () => medalModal.style.display = 'none';
        }

        window.onclick = (e) => {
            if (e.target === medalModal) medalModal.style.display = 'none';
        };
    }
});
