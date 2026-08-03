/* ==========================================================================
   ESTEBAN AULESTIA - PORTFOLIO INTERACTIVE LOGIC (COSMOS THEME)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initParticlesCanvas();
    initCustomCursor();
    initTypewriter();
    initHeaderScroll();
    initMobileNav();
    initScrollReveal();
    initStatsCounter();
    initContactForm();
    initScrollToTop();
});

/* ==========================================================================
   1. PARTICLES CANVAS BACKGROUND
   ========================================================================== */
function initParticlesCanvas() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let mouse = { x: null, y: null, radius: 150 };

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2 + 1;
            this.vx = (Math.random() - 0.5) * 0.8;
            this.vy = (Math.random() - 0.5) * 0.8;
            this.color = Math.random() > 0.5 ? 'rgba(6, 182, 212, ' : 'rgba(139, 92, 246, ';
            this.baseAlpha = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;

            // Mouse interaction
            if (mouse.x !== null && mouse.y !== null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    let force = (mouse.radius - dist) / mouse.radius;
                    this.x -= (dx / dist) * force * 3;
                    this.y -= (dy / dist) * force * 3;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color + this.baseAlpha + ')';
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color + '0.8)';
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    const particleCount = Math.min(Math.floor(window.innerWidth / 15), 90);
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                let dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 130) {
                    let alpha = (1 - dist / 130) * 0.25;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();
}

/* ==========================================================================
   2. CUSTOM GLOW CURSOR & FOLLOWER
   ========================================================================== */
function initCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.custom-cursor-follower');
    if (!cursor || !follower) return;

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        cursor.style.left = `${mouseX}px`;
        cursor.style.top = `${mouseY}px`;
    });

    function renderFollower() {
        followerX += (mouseX - followerX) * 0.2;
        followerY += (mouseY - followerY) * 0.2;

        follower.style.left = `${followerX}px`;
        follower.style.top = `${followerY}px`;

        requestAnimationFrame(renderFollower);
    }
    renderFollower();

    // Hover effect on interactive elements
    const hoverTargets = document.querySelectorAll('a, button, .project-card, .skill-chip, .info-card, .contact-card');
    hoverTargets.forEach(target => {
        target.addEventListener('mouseenter', () => {
            cursor.style.width = '45px';
            cursor.style.height = '45px';
            cursor.style.borderColor = 'var(--accent-pink)';
        });
        target.addEventListener('mouseleave', () => {
            cursor.style.width = '20px';
            cursor.style.height = '20px';
            cursor.style.borderColor = 'var(--accent-cyan)';
        });
    });
}

/* ==========================================================================
   3. TYPEWRITER EFFECT
   ========================================================================== */
function initTypewriter() {
    const target = document.querySelector('.typing-text');
    if (!target) return;

    const roles = [
        'Desarrollo Móvil (Flutter)',
        'Programación C++ & Java',
        'Desarrollo Web Fullstack',
        'OpenGL & Game Dev'
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let speed = 100;

    function type() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            target.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            speed = 50;
        } else {
            target.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            speed = 100;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            speed = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            speed = 500;
        }

        setTimeout(type, speed);
    }

    setTimeout(type, 800);
}

/* ==========================================================================
   4. HEADER & NAV SCROLL LOGIC
   ========================================================================== */
function initHeaderScroll() {
    const header = document.querySelector('.header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active link tracking
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
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
   5. MOBILE MENU TOGGLE
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
   6. SCROLL REVEAL ANIMATIONS
   ========================================================================== */
function initScrollReveal() {
    const revealElements = document.querySelectorAll(
        '.section-header, .glass-box, .info-card, .skill-category-card, .project-card, .timeline-card, .contact-card, .form-glass'
    );

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(35px)';
        el.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(el);
    });
}

/* ==========================================================================
   7. STATS ANIMATED COUNTER
   ========================================================================== */
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                let count = 0;
                const duration = 1500;
                const stepTime = duration / target;

                const timer = setInterval(() => {
                    count++;
                    entry.target.textContent = count + '+';
                    if (count >= target) {
                        clearInterval(timer);
                    }
                }, stepTime);

                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(num => observer.observe(num));
}

/* ==========================================================================
   8. CONTACT FORM INTERACTION
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;

        btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Enviando...`;
        btn.disabled = true;

        setTimeout(() => {
            showToast('¡Mensaje enviado con éxito! Me pondré en contacto contigo pronto.', 'success');
            form.reset();
            btn.innerHTML = originalText;
            btn.disabled = false;
        }, 1500);
    });
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        padding: 1rem 1.75rem;
        background: ${type === 'success' ? 'rgba(16, 185, 129, 0.95)' : 'rgba(6, 182, 212, 0.95)'};
        color: #fff;
        border-radius: 12px;
        font-family: var(--font-sans);
        font-weight: 600;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        z-index: 10000;
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.4s ease;
        backdrop-filter: blur(10px);
    `;
    toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.style.transform = 'translateY(0)';
        toast.style.opacity = '1';
    });

    setTimeout(() => {
        toast.style.transform = 'translateY(100px)';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

/* ==========================================================================
   9. SCROLL TO TOP BUTTON
   ========================================================================== */
function initScrollToTop() {
    const btn = document.getElementById('scrollTopBtn');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
