// Simple Cookie Consent Banner
(function() {
    'use strict';
    
    // Check if consent was already given
    function hasConsent() {
        return localStorage.getItem('cookieConsent') === 'true';
    }
    
    // Set consent
    function setConsent(value) {
        localStorage.setItem('cookieConsent', value);
        localStorage.setItem('cookieConsentDate', new Date().toISOString());
    }
    
    // Create and show banner
    function showCookieBanner() {
        // Don't show if already consented
        if (hasConsent()) {
            return;
        }
        
        // Create banner HTML
        const banner = document.createElement('div');
        banner.id = 'cookie-consent-banner';
        banner.innerHTML = `
            <div class="cookie-content">
                <p class="cookie-text">
                    We use cookies to enhance your experience and analyze site traffic. 
                    By clicking "Accept", you consent to our use of cookies.
                    <a href="/privacy.html" target="_blank">Learn more</a>
                </p>
                <div class="cookie-buttons">
                    <button id="cookie-accept" class="cookie-btn accept">Accept</button>
                    <button id="cookie-decline" class="cookie-btn decline">Decline</button>
                </div>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            #cookie-consent-banner {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: rgba(26, 26, 46, 0.98);
                border-top: 2px solid var(--magical-gold, #d4af37);
                padding: 1.5rem;
                z-index: 9999;
                animation: slideUp 0.5s ease;
                box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
            }
            
            .cookie-content {
                max-width: 1200px;
                margin: 0 auto;
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 2rem;
                flex-wrap: wrap;
            }
            
            .cookie-text {
                flex: 1;
                margin: 0;
                color: #fff;
                font-size: 0.95rem;
                line-height: 1.5;
            }
            
            .cookie-text a {
                color: var(--magical-gold, #d4af37);
                text-decoration: underline;
            }
            
            .cookie-buttons {
                display: flex;
                gap: 1rem;
            }
            
            .cookie-btn {
                padding: 0.6rem 1.5rem;
                border: none;
                border-radius: 5px;
                font-size: 0.95rem;
                cursor: pointer;
                transition: all 0.3s ease;
                font-weight: 600;
            }
            
            .cookie-btn.accept {
                background: linear-gradient(135deg, #d4af37, #f4e4a0);
                color: #1a1a2e;
            }
            
            .cookie-btn.accept:hover {
                background: linear-gradient(135deg, #f4e4a0, #d4af37);
                transform: translateY(-2px);
            }
            
            .cookie-btn.decline {
                background: transparent;
                color: #999;
                border: 1px solid #666;
            }
            
            .cookie-btn.decline:hover {
                background: rgba(255, 255, 255, 0.1);
                border-color: #999;
            }
            
            @keyframes slideUp {
                from {
                    transform: translateY(100%);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
            
            @media (max-width: 768px) {
                .cookie-content {
                    flex-direction: column;
                    text-align: center;
                    gap: 1rem;
                }
                
                .cookie-buttons {
                    width: 100%;
                    justify-content: center;
                }
                
                .cookie-btn {
                    flex: 1;
                    max-width: 150px;
                }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(banner);
        
        // Handle button clicks
        document.getElementById('cookie-accept').addEventListener('click', function() {
            setConsent('true');
            banner.style.animation = 'slideUp 0.5s ease reverse';
            setTimeout(() => banner.remove(), 500);
            
            // Enable analytics
            if (typeof gtag !== 'undefined') {
                gtag('consent', 'update', {
                    'analytics_storage': 'granted'
                });
            }
            if (typeof fbq !== 'undefined') {
                fbq('consent', 'grant');
            }
        });
        
        document.getElementById('cookie-decline').addEventListener('click', function() {
            setConsent('false');
            banner.style.animation = 'slideUp 0.5s ease reverse';
            setTimeout(() => banner.remove(), 500);
            
            // Disable analytics
            if (typeof gtag !== 'undefined') {
                gtag('consent', 'update', {
                    'analytics_storage': 'denied'
                });
            }
            if (typeof fbq !== 'undefined') {
                fbq('consent', 'revoke');
            }
        });
    }
    
    // Initialize consent status for analytics
    function initializeConsent() {
        const consent = hasConsent();
        
        // Set default consent state before analytics load
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        
        if (!consent) {
            // Default to denied until user accepts
            gtag('consent', 'default', {
                'analytics_storage': 'denied',
                'ad_storage': 'denied'
            });
        } else {
            gtag('consent', 'default', {
                'analytics_storage': 'granted',
                'ad_storage': 'granted'
            });
        }
    }
    
    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initializeConsent();
            showCookieBanner();
        });
    } else {
        initializeConsent();
        showCookieBanner();
    }
})();