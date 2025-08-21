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

// Card flip mechanism - PROPERLY FIXED for mobile and desktop
document.querySelectorAll('.caster-card').forEach(card => {
    let isFlipping = false;
    let touchHandled = false;
    
    // Handle flip for both touch and click
    const flipCard = (e) => {
        if (isFlipping) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        isFlipping = true;
        
        // Toggle the flipped class - this WILL flip back and forth
        if (card.classList.contains('flipped')) {
            card.classList.remove('flipped');
        } else {
            card.classList.add('flipped');
        }
        
        // Reset flag after animation
        setTimeout(() => {
            isFlipping = false;
            touchHandled = false;
        }, 600);
    };
    
    // Mobile touch handling
    card.addEventListener('touchstart', (e) => {
        touchHandled = false;
    }, { passive: true });
    
    card.addEventListener('touchend', (e) => {
        if (!touchHandled) {
            touchHandled = true;
            flipCard(e);
        }
    }, { passive: false });
    
    // Desktop click handling (only if touch wasn't handled)
    card.addEventListener('click', (e) => {
        if (!touchHandled) {
            flipCard(e);
        }
        touchHandled = false;
    });
});
    
    // Center scrollable sections on load
    window.addEventListener('load', () => {
        // Center arena image after it loads
        const arenaContent = document.querySelector('.arena-content');
        const arenaImage = document.querySelector('.arena-banner');
        
        if (arenaContent && arenaImage) {
            // Function to center the arena
            const centerArena = () => {
                if (window.innerWidth <= 768) {
                    // Calculate center position
                    const scrollAmount = (arenaContent.scrollWidth - arenaContent.clientWidth) / 2;
                    arenaContent.scrollLeft = scrollAmount;
                    console.log('Centered arena at:', scrollAmount);
                }
            };
            
            // If image is already loaded, center immediately
            if (arenaImage.complete) {
                setTimeout(centerArena, 200);
            } else {
                // Wait for image to load, then center
                arenaImage.addEventListener('load', () => {
                    setTimeout(centerArena, 200);
                });
            }
        }
        
        // Center game setup image - focus on the center, not left edge
        const showcase = document.querySelector('.components-showcase');
        const componentsOverlay = document.querySelector('.components-overlay');
        if (showcase) {
            setTimeout(() => {
                if (window.innerWidth <= 768) {
                    showcase.scrollLeft = (showcase.scrollWidth - showcase.clientWidth) * 0.4;
                } else {
                    showcase.scrollLeft = (showcase.scrollWidth - showcase.clientWidth) / 2;
                }
            }, 100);
        }
        if (componentsOverlay && componentsOverlay.scrollWidth > componentsOverlay.clientWidth) {
            setTimeout(() => {
                componentsOverlay.scrollLeft = (componentsOverlay.scrollWidth - componentsOverlay.clientWidth) * 0.4;
            }, 100);
        }
        
        // Center first caster card
        const castersGrid = document.querySelector('.casters-grid');
        if (castersGrid) {
            setTimeout(() => {
                const firstCard = castersGrid.querySelector('.caster-card');
                if (firstCard) {
                    firstCard.scrollIntoView({ behavior: 'auto', inline: 'center', block: 'nearest' });
                }
            }, 100);
        }
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

// Toggle components overlay - Make globally accessible and debug
function toggleComponentsOverlay() {
    const overlay = document.getElementById('componentsOverlay');
    if (!overlay) {
        console.error('Components overlay not found');
        return;
    }
    
    const toggleText = overlay.querySelector('.toggle-text');
    const toggleIcon = overlay.querySelector('.toggle-icon');
    
    // Toggle the collapsed class
    if (overlay.classList.contains('collapsed')) {
        overlay.classList.remove('collapsed');
        if (toggleText) toggleText.textContent = 'Hide List';
        if (toggleIcon) toggleIcon.textContent = '▼';
    } else {
        overlay.classList.add('collapsed');
        if (toggleText) toggleText.textContent = 'Show List';
        if (toggleIcon) toggleIcon.textContent = '▶';
    }
}

// Make it globally accessible
window.toggleComponentsOverlay = toggleComponentsOverlay;

// Also ensure it's available when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    // Re-attach in case inline onclick doesn't work
    const toggleBtn = document.querySelector('.overlay-toggle');
    if (toggleBtn) {
        toggleBtn.onclick = function() {
            toggleComponentsOverlay();
        };
    }
});

// Image modal for Who We Are section - Works on both desktop and mobile
document.addEventListener('DOMContentLoaded', function() {
    const aboutImages = document.querySelectorAll('.gallery-image, .about-visual img, .creator-photo');
    
    aboutImages.forEach(img => {
        img.style.cursor = 'pointer';
        img.setAttribute('title', 'Click to enlarge');
        
        img.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Create modal
            const modal = document.createElement('div');
            modal.className = 'image-modal';
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.95);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                cursor: pointer;
                animation: fadeIn 0.3s ease;
                padding: 20px;
            `;
            
            const modalImg = document.createElement('img');
            modalImg.src = this.src;
            modalImg.alt = this.alt || 'Enlarged image';
            modalImg.style.cssText = `
                max-width: 90%;
                max-height: 90%;
                width: auto;
                height: auto;
                object-fit: contain;
                animation: zoomIn 0.3s ease;
                border-radius: 10px;
                box-shadow: 0 0 50px rgba(212, 175, 55, 0.3);
            `;
            
            // Add close button
            const closeBtn = document.createElement('span');
            closeBtn.innerHTML = '&times;';
            closeBtn.style.cssText = `
                position: absolute;
                top: 20px;
                right: 30px;
                font-size: 40px;
                color: #d4af37;
                cursor: pointer;
                z-index: 10001;
                transition: transform 0.3s ease;
            `;
            
            closeBtn.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.2)';
            });
            
            closeBtn.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
            
            modal.appendChild(modalImg);
            modal.appendChild(closeBtn);
            document.body.appendChild(modal);
            
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
            
            // Close on click
            const closeModal = function() {
                modal.style.animation = 'fadeOut 0.3s ease';
                document.body.style.overflow = '';
                setTimeout(() => modal.remove(), 300);
            };
            
            modal.addEventListener('click', closeModal);
            closeBtn.addEventListener('click', closeModal);
            
            // Close on escape key
            const escapeHandler = function(e) {
                if (e.key === 'Escape') {
                    closeModal();
                    document.removeEventListener('keydown', escapeHandler);
                }
            };
            document.addEventListener('keydown', escapeHandler);
        });
    });
});

// Add animations for modal
if (!document.querySelector('#modalAnimations')) {
    const style = document.createElement('style');
    style.id = 'modalAnimations';
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        @keyframes zoomIn {
            from { transform: scale(0.8); }
            to { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
}

console.log('🎮 Welcome to Caster! May your magic be powerful and your victories legendary!');