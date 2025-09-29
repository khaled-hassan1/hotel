// Global Variables
let currentLanguage = 'ar';

// Language Switching Function
function switchLanguage(lang) {
    currentLanguage = lang;
    const html = document.documentElement;
    const body = document.body;

    // Update language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.lang === lang) {
            btn.classList.add('active');
        }
    });

    // Update HTML attributes
    html.setAttribute('lang', lang);
    body.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

    // Update Bootstrap RTL/LTR CSS
    const bootstrapLink = document.querySelector('link[href*="bootstrap"]');
    if (bootstrapLink) {
        if (lang === 'ar') {
            bootstrapLink.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.rtl.min.css';
        } else {
            bootstrapLink.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css';
        }
    }

    // Update all text content
    document.querySelectorAll('[data-ar][data-en]').forEach(element => {
        const text = element.getAttribute(`data-${lang}`);
        if (text) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = text;
            } else {
                element.innerHTML = text;
            }
        }
    });

    // Update placeholders
    document.querySelectorAll('[data-ar-placeholder][data-en-placeholder]').forEach(element => {
        const placeholder = element.getAttribute(`data-${lang}-placeholder`);
        if (placeholder) {
            element.placeholder = placeholder;
        }
    });

    // Store language preference
    localStorage.setItem('preferredLanguage', lang);

    // Update page title
    document.title = lang === 'ar' ? 'ION Hotel - فندق ايون' : 'ION Hotel - Luxury Accommodation';
}

// Navbar Scroll Effect
function handleNavbarScroll() {
    const navbar = document.querySelector('.header');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 0.5rem 1rem rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)';
    }
}

// Smooth Scrolling for Navigation Links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    bootstrap.Collapse.getInstance(navbarCollapse).hide();
                }
            }
        });
    });
}

// Contact Form Handling
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(contactForm);
            const name = contactForm.querySelector('input[type="text"]').value;
            const email = contactForm.querySelector('input[type="email"]').value;
            const phone = contactForm.querySelector('input[type="tel"]').value;
            const message = contactForm.querySelector('textarea').value;

            // Validation
            if (!name || !email || !message) {
                const errorMsg = currentLanguage === 'ar'
                    ? 'يرجى ملء جميع الحقول المطلوبة'
                    : 'Please fill in all required fields';

                showAlert(errorMsg, 'danger');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                const errorMsg = currentLanguage === 'ar'
                    ? 'يرجى إدخال بريد إلكتروني صحيح'
                    : 'Please enter a valid email address';

                showAlert(errorMsg, 'danger');
                return;
            }

            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = currentLanguage === 'ar' ? 'جاري الإرسال...' : 'Sending...';
            submitBtn.disabled = true;

            // Simulate form submission
            setTimeout(() => {
                const successMsg = currentLanguage === 'ar'
                    ? 'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.'
                    : 'Your message has been sent successfully! We will contact you soon.';

                showAlert(successMsg, 'success');
                contactForm.reset();

                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
}

// Alert Function
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 100px; right: 20px; z-index: 9999; max-width: 400px;';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.body.appendChild(alertDiv);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// Gallery Modal
function initGalleryModal() {
    const galleryImages = document.querySelectorAll('.gallery-item img');
    const modalImage = document.getElementById('modalImage');

    galleryImages.forEach(img => {
        img.addEventListener('click', function () {
            modalImage.src = this.src;
            modalImage.alt = this.alt;
        });
    });
}

// Intersection Observer for Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe cards and sections
    document.querySelectorAll('.card, .contact-item, .service-card').forEach(el => {
        observer.observe(el);
    });
}

// Active Navigation Link
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

    let current = '';
    const headerHeight = document.querySelector('.header').offsetHeight;

    sections.forEach(section => {
        const sectionTop = section.offsetTop - headerHeight - 100;
        const sectionHeight = section.clientHeight;

        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Preloader
// function showPreloader() {
//     const preloader = document.createElement('div');
//     preloader.id = 'preloader';
//     preloader.innerHTML = `
//         <div class="d-flex justify-content-center align-items-center h-100">
//             <div class="spinner-border text-primary" role="status">
//                 <span class="visually-hidden">Loading...</span>
//             </div>
//         </div>
//     `;
//     preloader.style.cssText = `
//         position: fixed;
//         top: 0;
//         left: 0;
//         width: 100%;
//         height: 100%;
//         background: white;
//         z-index: 9999;
//         transition: opacity 0.5s ease;
//     `;

//     document.body.appendChild(preloader);

//     // Hide preloader when page loads
//     window.addEventListener('load', () => {
//         setTimeout(() => {
//             preloader.style.opacity = '0';
//             setTimeout(() => {
//                 if (preloader.parentNode) {
//                     preloader.remove();
//                 }
//             }, 500);
//         }, 1000);
//     });
// }

// Initialize Everything
document.addEventListener('DOMContentLoaded', function () {
    // Show preloader
    // showPreloader();

    // Language switcher event listeners
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            switchLanguage(btn.dataset.lang);
        });
    });

    // Load saved language preference
    const savedLang = localStorage.getItem('preferredLanguage') || 'ar';
    switchLanguage(savedLang);

    // Initialize all functions
    initSmoothScrolling();
    initContactForm();
    initGalleryModal();
    initScrollAnimations();

    // Event listeners
    window.addEventListener('scroll', () => {
        handleNavbarScroll();
        updateActiveNavLink();
    });

    // Initialize Bootstrap tooltips and popovers
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Keyboard navigation
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            // Close any open modals
            const openModals = document.querySelectorAll('.modal.show');
            openModals.forEach(modal => {
                bootstrap.Modal.getInstance(modal).hide();
            });
        }
    });

    // Handle browser back/forward buttons
    window.addEventListener('popstate', function (e) {
        if (e.state && e.state.language) {
            switchLanguage(e.state.language);
        }
    });

    // Add loading states to buttons
    document.querySelectorAll('.btn').forEach(btn => {
        if (btn.type !== 'submit') {
            btn.addEventListener('click', function () {
                this.style.opacity = '0.8';
                setTimeout(() => {
                    this.style.opacity = '1';
                }, 200);
            });
        }
    });
});

// Performance optimization
window.addEventListener('load', function () {
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
});

const currentYear = new Date().getFullYear();
// Get the element by its current ID
const yearElement = document.getElementById('year-display');
// Update the text content of the element
yearElement.textContent = currentYear;

document.addEventListener('DOMContentLoaded', function() {
    const modalImage = document.getElementById('modalCertificateImage');
    const zoomInBtn = document.getElementById('zoomInBtn');
    const zoomOutBtn = document.getElementById('zoomOutBtn');
    const zoomResetBtn = document.getElementById('zoomResetBtn');
    const certificateModal = document.getElementById('certificateModal');

    let currentZoom = 1;
    const zoomStep = 0.1;
    const maxZoom = 3;
    const minZoom = 0.5;

    function applyZoom() {
        modalImage.style.transform = `scale(${currentZoom})`;
    }

    zoomInBtn.addEventListener('click', () => {
        if (currentZoom < maxZoom) {
            currentZoom += zoomStep;
            applyZoom();
        }
    });

    zoomOutBtn.addEventListener('click', () => {
        if (currentZoom > minZoom) {
            currentZoom -= zoomStep;
            applyZoom();
        }
    });

    zoomResetBtn.addEventListener('click', () => {
        currentZoom = 1;
        applyZoom();
        // Reset any drag position too
        modalImage.style.left = '0px';
        modalImage.style.top = '0px';
    });

    // Reset zoom when modal is closed or opened again
    certificateModal.addEventListener('hidden.bs.modal', () => {
        currentZoom = 1;
        applyZoom();
        modalImage.style.left = '0px';
        modalImage.style.top = '0px';
    });
    certificateModal.addEventListener('shown.bs.modal', () => {
        currentZoom = 1; // Ensure it starts at 1x on show
        applyZoom();
        modalImage.style.left = '0px';
        modalImage.style.top = '0px';
    });

    // Optional: Add drag functionality when zoomed
    let isDragging = false;
    let startX, startY;
    let imgX = 0, imgY = 0;

    modalImage.addEventListener('mousedown', (e) => {
        if (currentZoom > 1) { // Only enable drag if zoomed in
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            modalImage.style.cursor = 'grabbing';
            modalImage.style.transition = 'none'; // Disable transition during drag
            e.preventDefault(); // Prevent default image drag behavior
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        imgX += dx;
        imgY += dy;

        modalImage.style.left = `${imgX}px`;
        modalImage.style.top = `${imgY}px`;
        
        startX = e.clientX;
        startY = e.clientY;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        modalImage.style.cursor = (currentZoom > 1) ? 'grab' : 'zoom-in';
        modalImage.style.transition = 'transform 0.1s ease-out'; // Re-enable transition
    });

    // Optional: Mouse wheel zoom
    modalImage.addEventListener('wheel', (e) => {
        e.preventDefault();
        const rect = modalImage.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Calculate transform origin relative to the image
        modalImage.style.transformOrigin = `${mouseX}px ${mouseY}px`;

        if (e.deltaY < 0) { // Zoom in
            if (currentZoom < maxZoom) {
                currentZoom += zoomStep;
            }
        } else { // Zoom out
            if (currentZoom > minZoom) {
                currentZoom -= zoomStep;
            }
        }
        applyZoom();
    });

    // Ensure reset on modal close if dragged
    certificateModal.addEventListener('hidden.bs.modal', () => {
        modalImage.style.transformOrigin = 'center center'; // Reset origin
        modalImage.style.left = '0px';
        modalImage.style.top = '0px';
        imgX = 0;
        imgY = 0;
    });
});
