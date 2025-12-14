// ========== МОБИЛЬНОЕ МЕНЮ ==========
// Управление гамбургер-меню для мобильных устройств
const mobileMenu = document.getElementById('mobile-menu');
const navList = document.getElementById('nav-list');

if (mobileMenu && navList) {
    // Переключение меню при клике на гамбургер
    mobileMenu.addEventListener('click', () => {
        const isActive = mobileMenu.classList.toggle('active');
        navList.classList.toggle('active');
        mobileMenu.setAttribute('aria-expanded', isActive ? 'true' : 'false'); // Доступность
    });

    // Автоматическое закрытие меню при клике на ссылку
    const navLinks = navList.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            navList.classList.remove('active');
            mobileMenu.setAttribute('aria-expanded', 'false');
        });
    });
}

// ========== АНИМАЦИЯ ПРИ СКРОЛЛЕ ==========
// Настройки для Intersection Observer (отслеживание видимости элементов)
const observerOptions = {
    threshold: 0.1, // Элемент считается видимым при 10% видимости
    rootMargin: '0px 0px -50px 0px' // Отступ снизу для раннего срабатывания
};

// Observer для плавного появления секций при прокрутке
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Плавное появление элемента
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Применяем анимацию к секциям
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Анимация для фото при загрузке
    const photos = document.querySelectorAll('.photo, .middle-photo');
    photos.forEach((photo, index) => {
        photo.style.opacity = '0';
        photo.style.transform = 'scale(0.8)';
        setTimeout(() => {
            photo.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            photo.style.opacity = '1';
            photo.style.transform = 'scale(1)';
        }, index * 200);
    });

    // Параллакс эффект для среднего фото
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const middlePhoto = document.querySelector('.middle-photo-wrapper');
                if (middlePhoto) {
                    const rect = middlePhoto.getBoundingClientRect();
                    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
                    if (isVisible) {
                        const parallaxValue = (rect.top - window.innerHeight / 2) * 0.1;
                        middlePhoto.style.transform = `translateY(${parallaxValue}px) scale(1)`;
                    }
                }
                ticking = false;
            });
            ticking = true;
        }
    });

    // Интерактивность для карточек
    const cards = document.querySelectorAll('.section-card, .header-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.01)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Плавная анимация для ссылок
    const links = document.querySelectorAll('.contact-link');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            // Добавляем эффект пульсации
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });

    // Фон остается темным при скролле (динамическое изменение отключено)

    // Анимация появления текста по буквам для заголовка
    const nameElement = document.querySelector('.name');
    if (nameElement) {
        const text = nameElement.textContent;
        nameElement.textContent = '';
        nameElement.style.opacity = '1';
        
        text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.opacity = '0';
            span.style.animation = `fadeInChar 0.3s ease forwards ${index * 0.05}s`;
            nameElement.appendChild(span);
        });
    }
});

// Добавляем CSS анимацию для букв
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInChar {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Эффект частиц при клике (опционально)
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('section-card') || 
        e.target.closest('.section-card')) {
        createRipple(e);
    }
});

function createRipple(event) {
    const ripple = document.createElement('div');
    ripple.style.position = 'fixed';
    ripple.style.width = '20px';
    ripple.style.height = '20px';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 255, 255, 0.5)';
    ripple.style.pointerEvents = 'none';
    ripple.style.left = event.clientX - 10 + 'px';
    ripple.style.top = event.clientY - 10 + 'px';
    ripple.style.animation = 'ripple 0.6s ease-out';
    document.body.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Добавляем анимацию ripple
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(20);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Галерея
let currentGalleryIndex = 0;
const galleryTrack = document.getElementById('gallery-track');
const galleryItems = document.querySelectorAll('.gallery-item');
const galleryPrev = document.getElementById('gallery-prev');
const galleryNext = document.getElementById('gallery-next');
const galleryDots = document.querySelectorAll('.dot');
const totalItems = galleryItems.length;
const visibleItems = 3;

function updateGallery() {
    const translateX = -(currentGalleryIndex * (100 / visibleItems));
    if (galleryTrack) {
        galleryTrack.style.transform = `translateX(${translateX}%)`;
    }

    // Обновление точек
    galleryDots.forEach((dot, index) => {
        if (index === currentGalleryIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });

    // Скрытие/показ кнопок
    if (galleryPrev) {
        galleryPrev.style.opacity = currentGalleryIndex === 0 ? '0.5' : '1';
        galleryPrev.style.pointerEvents = currentGalleryIndex === 0 ? 'none' : 'auto';
    }
    if (galleryNext) {
        galleryNext.style.opacity = currentGalleryIndex >= totalItems - visibleItems ? '0.5' : '1';
        galleryNext.style.pointerEvents = currentGalleryIndex >= totalItems - visibleItems ? 'none' : 'auto';
    }
}

if (galleryPrev) {
    galleryPrev.addEventListener('click', () => {
        if (currentGalleryIndex > 0) {
            currentGalleryIndex--;
            updateGallery();
        }
    });
}

if (galleryNext) {
    galleryNext.addEventListener('click', () => {
        if (currentGalleryIndex < totalItems - visibleItems) {
            currentGalleryIndex++;
            updateGallery();
        }
    });
}

// Клик по точкам
galleryDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        if (index <= totalItems - visibleItems) {
            currentGalleryIndex = index;
            updateGallery();
        }
    });
});

// Инициализация галереи
if (galleryItems.length > 0) {
    updateGallery();
}

// Модальное окно для увеличенных фото
const modalOverlay = document.getElementById('modal-overlay');
const modalImg = document.getElementById('modal-img');
const modalClose = document.getElementById('modal-close');
const modalPrev = document.getElementById('modal-prev');
const modalNext = document.getElementById('modal-next');
let currentModalIndex = 0;
const galleryImages = Array.from(document.querySelectorAll('.gallery-img'));

function openModal(index) {
    currentModalIndex = index;
    if (modalOverlay && modalImg && galleryImages[index]) {
        modalImg.src = galleryImages[index].src;
        modalImg.alt = galleryImages[index].alt;
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        updateModalButtons();
    }
}

function closeModal() {
    if (modalOverlay) {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function updateModalButtons() {
    if (modalPrev) {
        modalPrev.style.display = currentModalIndex > 0 ? 'flex' : 'none';
    }
    if (modalNext) {
        modalNext.style.display = currentModalIndex < galleryImages.length - 1 ? 'flex' : 'none';
    }
}

// Открытие модального окна при клике на фото
galleryImages.forEach((img, index) => {
    img.addEventListener('click', () => {
        openModal(index);
    });
});

// Закрытие модального окна
if (modalClose) {
    modalClose.addEventListener('click', closeModal);
}

if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
}

// Навигация в модальном окне
if (modalPrev) {
    modalPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentModalIndex > 0) {
            currentModalIndex--;
            openModal(currentModalIndex);
        }
    });
}

if (modalNext) {
    modalNext.addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentModalIndex < galleryImages.length - 1) {
            currentModalIndex++;
            openModal(currentModalIndex);
        }
    });
}

// Закрытие по Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
        closeModal();
    }
    // Навигация стрелками
    if (modalOverlay && modalOverlay.classList.contains('active')) {
        if (e.key === 'ArrowLeft' && currentModalIndex > 0) {
            currentModalIndex--;
            openModal(currentModalIndex);
        }
        if (e.key === 'ArrowRight' && currentModalIndex < galleryImages.length - 1) {
            currentModalIndex++;
            openModal(currentModalIndex);
        }
    }
});

// Адаптивность галереи
function handleResize() {
    const isMobile = window.innerWidth <= 768;
    if (isMobile && currentGalleryIndex > totalItems - 1) {
        currentGalleryIndex = Math.max(0, totalItems - 1);
        updateGallery();
    }
}

window.addEventListener('resize', handleResize);
handleResize();

// Кнопка "Наверх"
const scrollToTopBtn = document.getElementById('scroll-to-top');

if (scrollToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ========== АНИМАЦИЯ ЧИСЕЛ В СТАТИСТИКЕ ==========
// Плавный счет чисел от 0 до целевого значения
function animateNumbers() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        threshold: 0.5 // Анимация запускается при 50% видимости
    };

    const numberObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Проверяем видимость и что анимация еще не запущена
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                const target = parseInt(entry.target.getAttribute('data-target')); // Целевое число
                const duration = 2000; // Длительность анимации (2 секунды)
                const increment = target / (duration / 16); // Шаг увеличения (60 FPS)
                let current = 0;
                
                entry.target.classList.add('animated'); // Помечаем как анимированное
                
                // Плавное увеличение числа
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        entry.target.textContent = target; // Финальное значение
                        clearInterval(timer);
                    } else {
                        entry.target.textContent = Math.floor(current); // Текущее значение
                    }
                }, 16); // ~60 кадров в секунду
            }
        });
    }, observerOptions);

    // Наблюдаем за всеми числами статистики
    statNumbers.forEach(stat => {
        numberObserver.observe(stat);
    });
}

// Запуск анимации чисел после полной загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(animateNumbers, 500); // Небольшая задержка для плавности
});

// ========== ПЛАВНАЯ ПРОКРУТКА ДЛЯ ЯКОРНЫХ ССЫЛОК ==========
// Обработка кликов по ссылкам с якорями (#section)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault(); // Отменяем стандартное поведение
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Учитываем высоту меню
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth' // Плавная прокрутка
            });
        }
    });
});

// ========== АККОРДЕОН ДЛЯ ДОСТИЖЕНИЙ ==========
// Реализация разворачивающихся блоков с информацией о достижениях
const accordionItems = document.querySelectorAll('.accordion-item');
accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    if (header) {
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Закрываем все остальные элементы аккордеона (только один открыт)
            accordionItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Переключаем текущий элемент (открыть/закрыть)
            item.classList.toggle('active', !isActive);
        });
    }
});

// ========== БЕГУЩАЯ СТРОКА ДОСТИЖЕНИЙ ==========
// Дублирование элементов для создания эффекта бесконечной прокрутки
const marqueeTrack = document.getElementById('marquee-track');
if (marqueeTrack) {
    const badges = marqueeTrack.querySelectorAll('.achievement-badge');
    // Клонируем все бейджи для плавной бесконечной прокрутки
    badges.forEach(badge => {
        const clone = badge.cloneNode(true);
        marqueeTrack.appendChild(clone);
    });
}

// Анимация финального блока
const finalCta = document.getElementById('final-cta');
if (finalCta) {
    const finalObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.5 });

    finalCta.style.opacity = '0';
    finalCta.style.transform = 'translateY(30px)';
    finalCta.style.transition = 'opacity 1s ease, transform 1s ease';
    finalObserver.observe(finalCta);
}

// Фон остается темным при скролле (эффект параллакса отключен)

