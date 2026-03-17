/**
 * CareerLaunch JavaScript
 * Handles interactivity: Mobile menu, accordions, form validation, and scroll animations.
 */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Mobile Menu Toggle
    const menuToggle = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    const navLinksList = document.querySelectorAll('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('is-active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when a link is clicked
    navLinksList.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('is-active');
            navMenu.classList.remove('active');
        });
    });

    // 2. Active Link Switching based on Scroll Position
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('header nav ul li a');

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Add offset for the fixed header height
            if (pageYOffset >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // 3. Smooth Scrolling for Anchor Links (fallback/enhancement)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                // Scroll accounting for navbar height (approx 80px)
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 4. Accordion for Interview Questions
    const accordions = document.querySelectorAll('.accordion-button');

    accordions.forEach(button => {
        button.addEventListener('click', () => {
            // Check if this button is already active
            const isActive = button.classList.contains('active');
            
            // Close all open accordions securely
            accordions.forEach(btn => {
                btn.classList.remove('active');
                btn.nextElementSibling.style.maxHeight = null;
            });

            // If it wasn't active, open it
            if (!isActive) {
                button.classList.add('active');
                const content = button.nextElementSibling;
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });

    // 5. Contact Form Validation
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent default form submission
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (name && email && message) {
                // Determine if it's a valid simple email format
                if (email.includes('@') && email.includes('.')) {
                    alert(`Thank you, ${name}! Your message has been sent successfully.`);
                    contactForm.reset();
                } else {
                    alert('Please enter a valid email address.');
                }
            } else {
                alert('Please fill out all fields.');
            }
        });
    }

    // 6. Scroll Animation (Intersection Observer)
    const fadeElements = document.querySelectorAll('.fade-in-section');

    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('is-visible');
                // observer.unobserve(entry.target); // Unobserving makes it animate only once
                // If you want it to trigger every time, remove the unobserve.
                // Keeping unobserve uncommented out for performance and single-trigger animation.
                observer.unobserve(entry.target); 
            }
        });
    }, appearOptions);

    fadeElements.forEach(el => {
        appearOnScroll.observe(el);
    });

});
