/* ==========================================================================
   ESTEBAN AULESTIA — INDUSTRIAL HIGH-PRECISION PORTFOLIO SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initTechCursor();
    initTypewriter();
    initHeaderScroll();
    initMobileNav();
    initStatsCounter();
    initContactForm();
});

/* ==========================================================================
   1. TECH CURSOR TRACKING
   ========================================================================== */
function initTechCursor() {
    const cursor = document.querySelector('.tech-cursor');
    const dot = document.querySelector('.tech-cursor-dot');
    if (!cursor || !dot) return;

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        dot.style.left = `${mouseX}px`;
        dot.style.top = `${mouseY}px`;
    });

    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.25;
        cursorY += (mouseY - cursorY) * 0.25;

        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    const hoverTargets = document.querySelectorAll('a, button, .project-card, .matrix-card, .spec-card, .tech-tag-chip');
    hoverTargets.forEach(target => {
        target.addEventListener('mouseenter', () => {
            cursor.style.width = '32px';
            cursor.style.height = '32px';
            cursor.style.background = 'rgba(255, 214, 0, 0.1)';
        });
        target.addEventListener('mouseleave', () => {
            cursor.style.width = '16px';
            cursor.style.height = '16px';
            cursor.style.background = 'transparent';
        });
    });
}

/* ==========================================================================
   2. TYPEWRITER EFFECT
   ========================================================================== */
function initTypewriter() {
    const target = document.querySelector('.role-typing');
    if (!target) return;

    const roles = [
        'Desarrollo Web PHP (Laravel / CodeIgniter)',
        'Especialista Next.js & Nest.js',
        'Full Stack Frontend & Backend',
        'Integración Claude API & MCP Protocols'
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let speed = 90;

    function type() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            target.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            speed = 40;
        } else {
            target.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            speed = 80;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            speed = 2200; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            speed = 400;
        }

        setTimeout(type, speed);
    }

    setTimeout(type, 500);
}

/* ==========================================================================
   3. HEADER & NAV SCROLL
   ========================================================================== */
function initHeaderScroll() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });
}

/* ==========================================================================
   4. MOBILE NAV TOGGLE
   ========================================================================== */
function initMobileNav() {
    const toggleBtn = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    if (!toggleBtn || !navMenu) return;

    toggleBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

/* ==========================================================================
   5. STATS ANIMATED COUNTER
   ========================================================================== */
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-num');
    if (statNumbers.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                let count = 0;
                const duration = 1200;
                const stepTime = Math.max(Math.floor(duration / target), 15);

                const timer = setInterval(() => {
                    count += Math.ceil(target / 40);
                    if (count >= target) {
                        count = target;
                        clearInterval(timer);
                    }
                    entry.target.textContent = count + '+';
                }, stepTime);

                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(num => observer.observe(num));
}

/* ==========================================================================
   6. INDUSTRIAL CONTACT FORM
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;

        btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> TRANSMITIENDO...`;
        btn.disabled = true;

        setTimeout(() => {
            showToast('¡MENSAJE TRANSMITIDO CON ÉXITO! TE RESPONDERÉ A LA BREVEDAD.');
            form.reset();
            btn.innerHTML = originalText;
            btn.disabled = false;
        }, 1200);
    });
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        padding: 16px 24px;
        background: #FFD600;
        color: #0A0A0A;
        font-family: var(--font-mono);
        font-size: 12px;
        font-weight: 800;
        border: 2px solid #0A0A0A;
        box-shadow: 0 10px 30px rgba(0,0,0,0.8);
        z-index: 10000;
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s ease;
    `;
    toast.innerHTML = `<i class="fas fa-check"></i> ${message}`;

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.style.transform = 'translateY(0)';
        toast.style.opacity = '1';
    });

    setTimeout(() => {
        toast.style.transform = 'translateY(100px)';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}
