document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.sidebar nav ul li a');
    const profileCards = document.querySelectorAll('.profile-card');
    const navItems = document.querySelectorAll('.sidebar nav ul li');
    const medalCards = document.querySelectorAll('.medal-card');
    const modal = document.getElementById('medalModal');
    const closeButton = document.querySelector('.close-button');
    const modalTitle = document.getElementById('modalTitle');
    const modalId = document.getElementById('modalId');
    const modalDescription = document.getElementById('modalDescription');

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

    function showProfile(targetId) {
        profileCards.forEach(card => {
            card.style.display = 'none';
        });

        const targetProfile = document.querySelector(targetId);
        if (targetProfile) {
            targetProfile.style.display = 'block';
            document.querySelector('.content').scrollIntoView({ behavior: 'smooth' });
        }
        
        navItems.forEach(item => {
            item.classList.remove('active');
        });

        const activeLink = document.querySelector(`a[href="${targetId}"]`);
        if (activeLink) {
            activeLink.parentElement.classList.add('active');
        }
    }

    const initialHash = window.location.hash || '#molly';
    showProfile(initialHash);

    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            
            const targetId = link.getAttribute('href');
            showProfile(targetId);

            history.pushState(null, null, targetId);
        });
    });
    
    window.addEventListener('popstate', () => {
        const hash = window.location.hash || '#molly';
        showProfile(hash);
    });
});
