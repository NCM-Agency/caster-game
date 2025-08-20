// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        
        // Animate hamburger menu
        navToggle.classList.toggle('active');
    });
    
    // Close menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
}

// Smooth Scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80; // Account for fixed navbar
            const targetPosition = target.offsetTop - offset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.background = 'rgba(26, 26, 46, 0.98)';
        navbar.style.padding = '0.5rem 0';
    } else {
        navbar.style.background = 'rgba(26, 26, 46, 0.95)';
        navbar.style.padding = '1rem 0';
    }
    
    lastScroll = currentScroll;
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Stagger animations for grid items
            if (entry.target.classList.contains('caster-card')) {
                const cards = document.querySelectorAll('.caster-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            }
        }
    });
}, observerOptions);

// Add fade-in class to sections
document.querySelectorAll('section').forEach(section => {
    section.classList.add('fade-in');
    observer.observe(section);
});

// Premium subtle glow effect
function createSubtleGlow() {
    const glowContainer = document.querySelector('.magical-glow');
    if (!glowContainer) return;
    
    // Add subtle animation variation
    const duration = 3 + Math.random() * 2;
    glowContainer.style.animationDuration = `${duration}s`;
}

// Parallax effect for arena banner
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.parallax');
    
    parallaxElements.forEach(element => {
        const speed = 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
});

// Form validation and submission
const vipForm = document.querySelector('.vip-form');
if (vipForm) {
    vipForm.addEventListener('submit', function(e) {
        const emailInput = this.querySelector('input[type="email"]');
        const submitBtn = this.querySelector('.btn-submit');
        
        // Visual feedback
        submitBtn.innerHTML = '<span>Submitting...</span>';
        submitBtn.disabled = true;
        
        // Netlify handles the actual submission
        setTimeout(() => {
            submitBtn.innerHTML = '<span>Welcome to VIP!</span>';
            submitBtn.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)';
        }, 1000);
    });
}

// Add hover effect to benefit items
document.querySelectorAll('.benefit-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.background = 'rgba(212, 175, 55, 0.2)';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.background = 'rgba(212, 175, 55, 0.1)';
    });
});

// Card tilt effect on hover (desktop only)
if (window.innerWidth > 768) {
    document.querySelectorAll('.caster-card').forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });
}

// Mobile card flip on tap
if (window.innerWidth <= 768) {
    document.querySelectorAll('.caster-card').forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.classList.toggle('flipped');
        });
    });
}

// Initialize premium particle effect
window.addEventListener('load', () => {
    createSubtleGlow();
});

// Loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 1s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Add magical cursor trail (optional enhancement)
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Create trail occasionally
    if (Math.random() > 0.95) {
        const trail = document.createElement('div');
        trail.style.position = 'fixed';
        trail.style.left = mouseX + 'px';
        trail.style.top = mouseY + 'px';
        trail.style.width = '4px';
        trail.style.height = '4px';
        trail.style.background = '#d4af37';
        trail.style.borderRadius = '50%';
        trail.style.pointerEvents = 'none';
        trail.style.animation = 'fadeOut 1s ease';
        trail.style.zIndex = '9999';
        
        document.body.appendChild(trail);
        
        setTimeout(() => {
            trail.remove();
        }, 1000);
    }
});

// Add fadeOut animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        0% { opacity: 1; transform: scale(1); }
        100% { opacity: 0; transform: scale(0); }
    }
`;
document.head.appendChild(style);

// Toggle components overlay
function toggleComponentsOverlay() {
    const overlay = document.getElementById('componentsOverlay');
    const toggleText = overlay.querySelector('.toggle-text');
    
    overlay.classList.toggle('collapsed');
    
    if (overlay.classList.contains('collapsed')) {
        toggleText.textContent = 'Show List';
    } else {
        toggleText.textContent = 'Hide List';
    }
}

console.log('🎮 Welcome to Caster! May your magic be powerful and your victories legendary!');