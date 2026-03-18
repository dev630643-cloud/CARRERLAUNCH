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
            
            const name = document.getElementById('contact-name').value.trim();
            const email = document.getElementById('contact-email').value.trim();
            const message = document.getElementById('contact-message').value.trim();

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
                observer.unobserve(entry.target); 
            }
        });
    }, appearOptions);

    fadeElements.forEach(el => {
        appearOnScroll.observe(el);
    });

    // 7. Resume Builder
    const resumeForm = document.getElementById('resumeForm');
    const resumePreview = document.getElementById('resumePreview');
    const downloadPdfBtn = document.getElementById('downloadPdfBtn');

    if (resumeForm) {
        resumeForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const data = {
                name: document.getElementById('rb-name').value.trim(),
                email: document.getElementById('rb-email').value.trim(),
                phone: document.getElementById('rb-phone').value.trim(),
                education: document.getElementById('rb-education').value.trim(),
                skills: document.getElementById('rb-skills').value.trim(),
                experience: document.getElementById('rb-experience').value.trim(),
                projects: document.getElementById('rb-projects').value.trim(),
                template: document.getElementById('rb-template').value
            };

            generateResume(data);
        });
    }

    function generateResume(data) {
        // Build the resume HTML
        let sectionsHTML = '';

        if (data.education) {
            sectionsHTML += `
                <div class="resume-section">
                    <h3><i class="fa-solid fa-graduation-cap"></i> Education</h3>
                    <p>${data.education}</p>
                </div>`;
        }
        if (data.skills) {
            sectionsHTML += `
                <div class="resume-section">
                    <h3><i class="fa-solid fa-star"></i> Skills</h3>
                    <p>${data.skills}</p>
                </div>`;
        }
        if (data.experience) {
            sectionsHTML += `
                <div class="resume-section">
                    <h3><i class="fa-solid fa-briefcase"></i> Experience</h3>
                    <p>${data.experience}</p>
                </div>`;
        }
        if (data.projects) {
            sectionsHTML += `
                <div class="resume-section">
                    <h3><i class="fa-solid fa-diagram-project"></i> Projects</h3>
                    <p>${data.projects}</p>
                </div>`;
        }

        resumePreview.className = `builder-preview-card resume-output ${data.template}`;
        resumePreview.innerHTML = `
            <h2>${data.name}</h2>
            <div class="resume-contact">
                ${data.email ? `<span><i class="fa-solid fa-envelope"></i> ${data.email}</span>` : ''}
                ${data.phone ? `<span><i class="fa-solid fa-phone"></i> ${data.phone}</span>` : ''}
            </div>
            ${sectionsHTML}
        `;

        // Show the download button
        if (downloadPdfBtn) {
            downloadPdfBtn.style.display = 'inline-flex';
        }

        // Scroll to preview on mobile
        if (window.innerWidth < 992) {
            resumePreview.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // PDF Download (clone-based for reliable rendering)
    if (downloadPdfBtn) {
        downloadPdfBtn.addEventListener('click', function() {
            // Clone the resume to avoid rendering issues
            const clone = resumePreview.cloneNode(true);
            clone.style.display = 'block';
            clone.style.background = '#ffffff';
            clone.style.color = '#000000';
            clone.style.width = '794px';
            clone.style.minHeight = '1123px';
            clone.style.padding = '40px';
            clone.style.position = 'absolute';
            clone.style.left = '-9999px';

            document.body.appendChild(clone);

            const opt = {
                margin: 0,
                filename: 'resume.pdf',
                image: { type: 'jpeg', quality: 1 },
                html2canvas: {
                    scale: 4,
                    backgroundColor: '#ffffff',
                    useCORS: true
                },
                jsPDF: {
                    unit: 'px',
                    format: [794, 1123],
                    orientation: 'portrait'
                }
            };

            setTimeout(() => {
                html2pdf().set(opt).from(clone).save().then(() => {
                    document.body.removeChild(clone);
                });
            }, 1000);
        });
    }

});

