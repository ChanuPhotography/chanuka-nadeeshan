// script.js - Photographer Portfolio

document.addEventListener('DOMContentLoaded', () => {

    // 1. Navbar Scrolled Effect
    const navbar = document.querySelector('.navbar');
    let scrollTicking = false;

    function updateNavbar() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        scrollTicking = false;
    }

    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            window.requestAnimationFrame(updateNavbar);
            scrollTicking = true;
        }
    }, { passive: true });

    // Add is-loaded class after a small tick to show navigation and main text quickly
    setTimeout(() => {
        document.body.classList.add('is-loaded');
    }, 50);

    // 2. Mobile Menu Close on Click
    const navLinks = document.querySelectorAll('.nav-link');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const navbarToggler = document.querySelector('.navbar-toggler');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Manual active class update for immediate feedback
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                navbarToggler.click();
            }
        });
    });

    // 3. Gallery Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-grid-item');

    if (filterBtns.length > 0 && galleryItems.length > 0) {
        const isHomePageGallery = document.getElementById('homeGalleryContainer') !== null;

        // Apply initial filtering for index page (only show featured in "All")
        if (isHomePageGallery) {
            galleryItems.forEach(item => {
                if (!item.classList.contains('featured')) {
                    item.style.display = 'none';
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.95)';
                }
            });
        }

        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.target;
                if (target.classList.contains('active')) return;

                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                target.classList.add('active');

                const filterValue = target.getAttribute('data-filter');

                // Filter items with a clean staggered transition
                galleryItems.forEach((item, index) => {
                    let shouldShow = false;
                    if (filterValue === 'all') {
                        shouldShow = isHomePageGallery ? item.classList.contains('featured') : true;
                    } else if (item.classList.contains(filterValue)) {
                        shouldShow = true;
                    }

                    if (shouldShow) {
                        item.style.display = 'block';
                        // Fast tick for opacity and transform
                        requestAnimationFrame(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        });
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.95)';
                        // Use transitionend or a fixed timeout to hide
                        setTimeout(() => {
                            if (item.style.opacity === '0') {
                                item.style.display = 'none';
                            }
                        }, 400);
                    }
                });
            });
        });
    }

    // 4. Lightbox Modal logic
    const lightboxModal = document.getElementById('lightboxModal');
    if (lightboxModal) {
        lightboxModal.addEventListener('show.bs.modal', function (event) {
            const button = event.relatedTarget;
            const imgSrc = button.getAttribute('data-bs-img');
            const imgCaption = button.getAttribute('data-bs-caption');

            const modalImg = lightboxModal.querySelector('.modal-body img');
            const modalCaption = lightboxModal.querySelector('.modal-caption');

            if (modalImg) modalImg.src = imgSrc;
            if (modalCaption) modalCaption.textContent = imgCaption;
        });
    }

    // 5. Scroll Animations Setup using AOS
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => {
        // Map common old classes to AOS attributes
        if (el.classList.contains('fade-up')) el.setAttribute('data-aos', 'fade-up');
        if (el.classList.contains('fade-right')) el.setAttribute('data-aos', 'fade-right');
        if (el.classList.contains('fade-left')) el.setAttribute('data-aos', 'fade-left');
        if (el.classList.contains('zoom-in')) el.setAttribute('data-aos', 'zoom-in');
        
        // Map delays
        if (el.classList.contains('delay-100')) el.setAttribute('data-aos-delay', '100');
        if (el.classList.contains('delay-200')) el.setAttribute('data-aos-delay', '200');
        if (el.classList.contains('delay-300')) el.setAttribute('data-aos-delay', '300');
        
        // Default if it has no specific animation class
        if (!el.hasAttribute('data-aos')) el.setAttribute('data-aos', 'fade-up');
    });

    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 50
        });
    }

    // Initialize Lenis for Smooth Scrolling
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        });

        // Keep AOS in sync with Lenis smooth scroll
        lenis.on('scroll', () => {
            if (typeof AOS !== 'undefined') AOS.refresh();
        });

        // Vanilla JS Parallax for Hero & Headers with caching for performance
        const parallaxElements = document.querySelectorAll('.hero-content, .gallery-page-header .container');
        
        if (parallaxElements.length > 0) {
            // Disable initial CSS transition after load to prevent conflict with JS scroll transforms
            setTimeout(() => {
                parallaxElements.forEach(el => el.style.transition = 'none');
            }, 2500);

            lenis.on('scroll', () => {
                const scrollY = window.scrollY;
                parallaxElements.forEach(el => {
                    const rect = el.getBoundingClientRect();
                    // Basic viewport check for performance
                    if (rect.top < window.innerHeight && rect.bottom > 0) {
                        // Smooth translate and fade out
                        el.style.transform = `translateY(${scrollY * 0.35}px)`;
                        el.style.opacity = Math.max(0, 1 - (scrollY / 400));
                    }
                });
            });
        }

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    // 6. Service Card Navigation
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.getAttribute('data-category');
            if (category) {
                window.location.href = `gallery.html?category=${category}`;
            } else {
                window.location.href = 'gallery.html';
            }
        });
    });

    // 7. Auto-scroll and filter gallery based on URL category
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    if (categoryParam) {
        // Wait a bit to let other initialization finish and the DOM to be fully prepared
        setTimeout(() => {
            const filterBtn = document.querySelector(`.filter-btn[data-filter="${categoryParam}"]`);
            if (filterBtn) {
                // Trigger the filter
                filterBtn.click();
                
                // Scroll to the gallery
                const gallerySection = document.querySelector('.gallery-content');
                if (gallerySection) {
                    const navHeight = document.getElementById('mainNav')?.offsetHeight || 70;
                    const offsetPosition = gallerySection.getBoundingClientRect().top + window.scrollY - navHeight - 20;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        }, 300);
    }
});
