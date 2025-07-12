document.addEventListener('DOMContentLoaded', () => {
    // Get elements
    // Removed loginPage and related elements as login is bypassed
    const mainContent = document.getElementById('main-content');
    const messageBox = document.getElementById('message-box'); // Still useful for general messages

    // Navigation links (now using href for direct file navigation)
    // Select all nav-links and nav-link-mobile to apply common JS (like mobile menu toggle)
    // Page switching logic within JS is mostly for the home page's internal sections if any
    const navLinks = document.querySelectorAll('.nav-link');
    const navLinksMobile = document.querySelectorAll('.nav-link-mobile');
    const logoutButton = document.getElementById('logout-button');
    const logoutButtonMobile = document.getElementById('logout-button-mobile');
    const welcomeMessage = document.getElementById('welcome-message');
    const homePageBrand = document.getElementById('nav-home-brand');

    // Mobile menu elements
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenuDropdown = document.getElementById('mobile-menu-dropdown');
    const mobileMenuIconOpen = document.getElementById('mobile-menu-icon-open');
    const mobileMenuIconClose = document.getElementById('mobile-menu-icon-close');

    // Carousel elements (only present on index.html)
    const carouselContainer = document.getElementById('carousel-container');
    const carouselSlides = document.querySelectorAll('.carousel-slide');
    const carouselDotsContainer = document.getElementById('carousel-dots');
    const prevButton = document.getElementById('carousel-prev');
    const nextButton = document.getElementById('carousel-next');

    // Element to display announcements (only present on index.html)
    const announcementsContainer = document.getElementById('announcements-container');


    let currentUserName = 'Guest'; // Default to 'Guest' as no login is required
    let currentSlideIndex = 0; // For the carousel
    let carouselInterval; // To store the interval for auto-play

    // Function to display messages (replaces alert())
    function showMessage(message, type = 'error') {
        if (!messageBox) return; // Ensure messageBox exists on the current page
        messageBox.textContent = message;
        messageBox.className = `mt-4 p-3 rounded-md text-center ${type === 'error' ? 'error' : 'success'}`;
        messageBox.classList.remove('hidden');
        setTimeout(() => {
            if (messageBox) messageBox.classList.add('hidden'); // Check again before hiding
        }, 3000); // Hide after 3 seconds
    }

    // This function is now primarily for internal content switching within a single HTML file.
    // For navigation between different HTML files, standard 'href' will be used.
    function showPageContent(pageId) {
        // This logic is mostly relevant for index.html if it has multiple sections
        // other than the carousel and announcements.
        // For now, it's simplified as navigation is handled by href.
        // If you add internal sections to academics.html, you'd replicate this logic there.
        const pageContents = document.querySelectorAll('.page-content'); // Get page contents specific to the current HTML file
        pageContents.forEach(page => {
            page.classList.add('hidden'); // Hide all pages
        });
        const targetPage = document.getElementById(`${pageId}-page-content`);
        if (targetPage) {
            targetPage.classList.remove('hidden'); // Show the target page
        }

        // Carousel and announcements are specific to index.html
        if (pageId === 'home' && window.location.pathname.endsWith('index.html')) {
            startCarousel();
            fetchAndDisplayAnnouncements();
        } else {
            stopCarousel();
        }

        // Close mobile menu if open
        if (!mobileMenuDropdown.classList.contains('hidden')) {
            toggleMobileMenu();
        }
    }

    // Carousel Functions (only run if carousel elements exist on the page)
    function showSlide(index) {
        if (!carouselSlides || carouselSlides.length === 0) return;

        if (index >= carouselSlides.length) {
            currentSlideIndex = 0;
        } else if (index < 0) {
            currentSlideIndex = carouselSlides.length - 1;
        } else {
            currentSlideIndex = index;
        }

        carouselSlides.forEach(slide => slide.classList.add('hidden'));
        if (carouselDotsContainer) {
            Array.from(carouselDotsContainer.children).forEach(dot => dot.classList.remove('active'));
        }

        carouselSlides[currentSlideIndex].classList.remove('hidden');
        if (carouselDotsContainer && carouselDotsContainer.children[currentSlideIndex]) {
            carouselDotsContainer.children[currentSlideIndex].classList.add('active');
        }
    }

    function nextSlide() {
        showSlide(currentSlideIndex + 1);
    }

    function prevSlide() {
        showSlide(currentSlideIndex - 1);
    }

    function startCarousel() {
        if (carouselSlides && carouselSlides.length > 1) {
            stopCarousel();
            carouselInterval = setInterval(nextSlide, 5000);
        }
    }

    function stopCarousel() {
        clearInterval(carouselInterval);
    }

    function createCarouselDots() {
        if (carouselDotsContainer && carouselSlides && carouselSlides.length > 0) {
            carouselDotsContainer.innerHTML = '';
            carouselSlides.forEach((_, index) => {
                const dot = document.createElement('span');
                dot.classList.add('carousel-dot');
                dot.addEventListener('click', () => showSlide(index));
                carouselDotsContainer.appendChild(dot);
            });
            showSlide(currentSlideIndex);
        }
    }

    // Function to fetch and display announcements (simulated data fetch)
    async function fetchAndDisplayAnnouncements() {
        if (!announcementsContainer) return;

        announcementsContainer.innerHTML = '<p class="text-gray-500 text-center">Loading announcements...</p>';

        try {
            const mockAnnouncements = [
                { "id": 1, "title": "New Academic Year Begins!", "date": "2025-08-01", "content": "Classes for all programs will commence on August 1st, 2025. Students are advised to check their timetables." },
                { "id": 2, "title": "Annual Tech Fest Registration Open", "date": "2025-07-25", "content": "Register now for our annual Tech Fest! Exciting workshops and competitions await." },
                { "id": 3, "title": "Guest Lecture on AI Ethics", "date": "2025-07-20", "content": "Join us for a special lecture on AI Ethics by Dr. Jane Doe on July 20th at 10 AM in Auditorium A." }
            ];

            const data = mockAnnouncements;

            announcementsContainer.innerHTML = '';

            if (data.length > 0) {
                const ul = document.createElement('ul');
                ul.classList.add('list-disc', 'list-inside', 'text-left', 'space-y-2');
                data.forEach(announcement => {
                    const li = document.createElement('li');
                    li.innerHTML = `<span class="font-semibold">${announcement.title}</span> - ${announcement.date}: ${announcement.content}`;
                    ul.appendChild(li);
                });
                announcementsContainer.appendChild(ul);
            } else {
                announcementsContainer.innerHTML = '<p class="text-gray-500 text-center">No announcements available at the moment.</p>';
            }

        } catch (error) {
            console.error('Error fetching announcements:', error);
            announcementsContainer.innerHTML = '<p class="text-red-600 text-center">Failed to load announcements. Please try again later.</p>';
        }
    }

    // No login form handling needed in this version.

    // Handle Navigation Links (Desktop and Mobile)
    // These links now directly point to HTML files, so JS only handles mobile menu toggle
    // and potentially internal content switching if a page has sub-sections.
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // No need for e.preventDefault() if we want browser to navigate
            // If you want smooth transitions or internal section scrolling, you'd add logic here
            // For now, let the browser handle the href.
            // Just ensure mobile menu closes if clicked.
            if (!mobileMenuDropdown.classList.contains('hidden')) {
                toggleMobileMenu();
            }
        });
    });

    navLinksMobile.forEach(link => {
        link.addEventListener('click', () => {
            // Same as above
            if (!mobileMenuDropdown.classList.contains('hidden')) {
                toggleMobileMenu();
            }
        });
    });

    // Handle Home Page Brand Click (always navigates to index.html)
    if (homePageBrand) {
        homePageBrand.addEventListener('click', (e) => {
            // Let browser navigate to index.html
        });
    }


    // Handle Logout - This button now simply clears the welcome message and effectively "resets" the state
    function handleLogout() {
        // Since there's no login, "logout" simply means going back to a default state or perhaps a "welcome" screen.
        currentUserName = 'Guest';
        if (welcomeMessage) welcomeMessage.textContent = `Welcome, ${currentUserName}!`;
        // Navigate to home page
        window.location.href = 'index.html';
        showMessage('You are now viewing as a Guest.', 'success');
        stopCarousel(); // Stop carousel on "logout"
    }

    if (logoutButton) logoutButton.addEventListener('click', handleLogout);
    if (logoutButtonMobile) logoutButtonMobile.addEventListener('click', handleLogout);

    // Toggle Mobile Menu
    function toggleMobileMenu() {
        if (mobileMenuDropdown) mobileMenuDropdown.classList.toggle('hidden');
        if (mobileMenuIconOpen) mobileMenuIconOpen.classList.toggle('hidden');
        if (mobileMenuIconClose) mobileMenuIconClose.classList.toggle('hidden');
    }
    if (mobileMenuButton) mobileMenuButton.addEventListener('click', toggleMobileMenu);

    // Carousel event listeners (only add if elements exist on the current page)
    if (prevButton) prevButton.addEventListener('click', prevSlide);
    if (nextButton) nextButton.addEventListener('click', nextSlide);


    // Initial setup: directly show the main content and home page if on index.html
    // No need for 'isAuthenticated' check anymore
    // The loginPage is assumed to be removed from index.html
    if (mainContent) mainContent.classList.remove('hidden'); // Ensure main content is always visible
    if (welcomeMessage) welcomeMessage.textContent = `Welcome, ${currentUserName}!`; // Set initial welcome message

    // Specific logic for index.html (home page)
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        // Only run carousel and announcement fetching if on the home page
        if (carouselContainer && carouselSlides.length > 0) {
            createCarouselDots();
            startCarousel(); // Start carousel automatically on home page load
        }
        fetchAndDisplayAnnouncements(); // Fetch announcements on home page load
    }
});

