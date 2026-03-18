// ===============================
// Прелоадер
// ===============================
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('hidden');
        setTimeout(() => preloader.remove(), 500);
    }
});

// ===============================
// Индикатор прокрутки
// ===============================
const scrollProgress = document.getElementById('scrollProgress');
if (scrollProgress) {
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        scrollProgress.style.width = scrolled + '%';
    });
}

// ===============================
// Переключатель темы
// ===============================
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        themeToggle.classList.add('rotating');
        setTimeout(() => themeToggle.classList.remove('rotating'), 500);

        body.classList.toggle('dark-theme');
        body.classList.toggle('light-theme');
        localStorage.setItem('theme', body.classList.contains('dark-theme') ? 'dark' : 'light');
    });

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
    }
}

// ===============================
// Мобильное меню
// ===============================
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav');
const navLinks = document.querySelectorAll('.nav__list a');

if (burger) {
    burger.addEventListener('click', () => {
        nav.classList.toggle('active');
        burger.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            burger.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });
}

// ===============================
// Модальные окна
// ===============================
const modals = {
    booking: document.getElementById('bookingModal'),
    team: document.getElementById('teamModal'),
    testimonials: document.getElementById('testimonialsModal')
};

document.querySelectorAll('[data-modal]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const modalName = trigger.getAttribute('data-modal');
        if (modals[modalName]) {
            modals[modalName].style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    });
});

Object.values(modals).forEach(modal => {
    if (!modal) return;
    const closeBtn = modal.querySelector('.modal__close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        });
    }
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
});

// ===============================
// Слайдер отзывов
// ===============================
const slider = document.getElementById('testimonialsSlider');
if (slider) {
    const testimonials = slider.querySelectorAll('.testimonial');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    let current = 0;

    function showSlide(index) {
        testimonials.forEach((t, i) => {
            t.classList.toggle('active', i === index);
        });
    }

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            current = (current - 1 + testimonials.length) % testimonials.length;
            showSlide(current);
        });

        nextBtn.addEventListener('click', () => {
            current = (current + 1) % testimonials.length;
            showSlide(current);
        });

        setInterval(() => {
            current = (current + 1) % testimonials.length;
            showSlide(current);
        }, 5000);
    }

    function setTestimonialsHeight() {
        let maxHeight = 0;
        testimonials.forEach(t => {
            t.style.display = 'block';
            maxHeight = Math.max(maxHeight, t.offsetHeight);
            t.style.display = '';
        });
        slider.style.height = maxHeight + 'px';
    }

    setTestimonialsHeight();
    window.addEventListener('resize', setTestimonialsHeight);
}

// ===============================
// Уведомления (toast)
// ===============================
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span class="toast__icon">${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}</span>
        <span class="toast__message">${message}</span>
    `;
    toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// ===============================
// Маска телефона
// ===============================
function phoneMask(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 0) {
        if (value.startsWith('7')) value = value.slice(1);
        let formatted = '+7';
        if (value.length > 0) formatted += ' ' + value.slice(0, 3);
        if (value.length > 3) formatted += ' ' + value.slice(3, 6);
        if (value.length > 6) formatted += ' ' + value.slice(6, 8);
        if (value.length > 8) formatted += ' ' + value.slice(8, 10);
        input.value = formatted.trim();
    } else {
        input.value = '';
    }
}

// ===============================
// Формы
// ===============================
const quickBookingForm = document.getElementById('quickBookingForm');
if (quickBookingForm) {
    const phoneInput = quickBookingForm.querySelector('input[type="tel"]');
    if (phoneInput) phoneInput.addEventListener('input', () => phoneMask(phoneInput));

    quickBookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('Заявка отправлена! Мы свяжемся с вами.', 'success');
        quickBookingForm.reset();
    });
}

const modalBookingForm = document.getElementById('modalBookingForm');
if (modalBookingForm) {
    const phoneInput = modalBookingForm.querySelector('input[type="tel"]');
    if (phoneInput) phoneInput.addEventListener('input', () => phoneMask(phoneInput));

    modalBookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('Бронирование подтверждено!', 'success');
        modalBookingForm.reset();
        if (modals.booking) {
            modals.booking.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
}

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    const phoneInput = contactForm.querySelector('input[type="tel"]');
    if (phoneInput) phoneInput.addEventListener('input', () => phoneMask(phoneInput));

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('Сообщение отправлено!', 'success');
        contactForm.reset();
    });
}

const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
    const phoneInput = bookingForm.querySelector('input[type="tel"]');
    if (phoneInput) phoneInput.addEventListener('input', () => phoneMask(phoneInput));

    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('Запрос отправлен! Мы перезвоним вам.', 'success');
        bookingForm.reset();
    });
}

// ===============================
// Анимация появления (Intersection Observer)
// ===============================
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.2, rootMargin: '0px' });

reveals.forEach(el => observer.observe(el));

// ===============================
// Параллакс для секций
// ===============================
document.querySelectorAll('[data-parallax-src]').forEach(section => {
    const src = section.getAttribute('data-parallax-src');
    if (src) {
        section.style.backgroundImage = `url(${src})`;
        section.style.backgroundSize = 'cover';
        section.style.backgroundPosition = 'center';
        section.style.willChange = 'background-position';
    }
});

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    document.querySelectorAll('[data-parallax-src]').forEach(section => {
        const speed = parseFloat(section.dataset.parallaxSpeed) || -0.3;
        section.style.backgroundPosition = `center ${scrollY * speed}px`;
    });
});

// ===============================
// Параллакс для декоративных слоёв
// ===============================
const parallaxLayers = document.querySelectorAll('.parallax-layer');
if (parallaxLayers.length) {
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        parallaxLayers.forEach(layer => {
            const speed = parseFloat(layer.dataset.speed) || 0.1;
            const direction = layer.dataset.direction || 'vertical';
            let transform = '';
            if (direction === 'vertical') {
                transform = `translateY(${scrollY * speed}px)`;
            } else if (direction === 'horizontal') {
                transform = `translateX(${scrollY * speed}px)`;
            } else if (direction === 'both') {
                transform = `translate(${scrollY * speed * 0.5}px, ${scrollY * speed}px)`;
            }
            layer.style.transform = transform;
        });
    });
}

// ===============================
// Анимация счётчиков (статистика)
// ===============================
const stats = document.querySelectorAll('.stat-number');
if (stats.length) {
    const observerStats = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.target);
                if (isNaN(target)) return;
                let current = 0;
                const step = target / 50;
                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        el.textContent = target;
                        clearInterval(timer);
                    } else {
                        el.textContent = Math.floor(current);
                    }
                }, 20);
                observerStats.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    stats.forEach(stat => observerStats.observe(stat));
}

// ===============================
// Плавный скролл к якорям
// ===============================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPos = target.getBoundingClientRect().top + window.scrollY - headerHeight;
            window.scrollTo({ top: targetPos, behavior: 'smooth' });
        }
    });
});

const heroScroll = document.getElementById('heroScroll');
if (heroScroll) {
    heroScroll.addEventListener('click', () => {
        const targetId = heroScroll.dataset.target;
        if (targetId) {
            const target = document.getElementById(targetId);
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPos = target.getBoundingClientRect().top + window.scrollY - headerHeight;
                window.scrollTo({ top: targetPos, behavior: 'smooth' });
            }
        }
    });
}

// ===============================
// Ripple-эффект на кнопках
// ===============================
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const x = e.clientX - this.getBoundingClientRect().left;
        const y = e.clientY - this.getBoundingClientRect().top;
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});

// ===============================
// VanillaTilt инициализация
// ===============================
if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
        max: 8,
        speed: 400,
        glare: true,
        "max-glare": 0.3,
        scale: 1.02,
    });
}


// ===============================
// Тень внизу экрана
// ===============================
const scrollShadow = document.getElementById('scrollShadow');
if (scrollShadow) {
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        scrollShadow.style.opacity = scrollY < maxScroll - 10 ? '1' : '0';
    });
}

// ===============================
// Анимация заголовка hero по словам
// ===============================
const heroTitle = document.querySelector('.hero__title');
if (heroTitle) {
    const text = heroTitle.innerText;
    heroTitle.innerHTML = '';
    text.split(' ').forEach((word, index) => {
        const span = document.createElement('span');
        span.innerText = word + (index < text.split(' ').length - 1 ? ' ' : '');
        heroTitle.appendChild(span);
    });
}


// ===============================
// Инициализация простой карусели (только если элемент существует)
// ===============================
if (document.querySelector('.dishes-swiper-simple')) {
    const swiper = new Swiper('.dishes-swiper-simple', {
        slidesPerView: 1,
        spaceBetween: 20,
        centeredSlides: true,
        loop: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
        },
        speed: 400,
        autoplay: false,
        grabCursor: true,
    });
}

// ===============================
// Табы для страницы меню с плавной анимацией
const menuTabs = document.querySelectorAll('.menu-tab');
const menuCategories = document.querySelectorAll('.menu-category');

if (menuTabs.length && menuCategories.length) {
    let activeCategory = 'all';

    function switchCategory(categoryId) {
        if (categoryId === activeCategory) return; // ничего не делаем, если та же категория

        // Находим категории, которые нужно скрыть и показать
        const toHide = [];
        const toShow = [];

        menuCategories.forEach(cat => {
            if (categoryId === 'all' || cat.dataset.category === categoryId) {
                toShow.push(cat);
            } else {
                toHide.push(cat);
            }
        });

        // Скрываем старые с анимацией
        toHide.forEach(cat => {
            cat.classList.add('fade-out');
            setTimeout(() => {
                cat.classList.add('hidden');
                cat.classList.remove('fade-out');
            }, 400); // длительность анимации
        });

        // Показываем новые с анимацией
        toShow.forEach(cat => {
            cat.classList.remove('hidden');
            cat.classList.add('fade-in');
            setTimeout(() => {
                cat.classList.remove('fade-in');
            }, 400);
        });

        // Обновляем активную вкладку
        menuTabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.category === categoryId);
        });

        activeCategory = categoryId;
    }

    // Устанавливаем активную вкладку "Все"
    switchCategory('all');

    menuTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            switchCategory(tab.dataset.category);
        });
    });
}