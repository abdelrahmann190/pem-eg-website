document.addEventListener('DOMContentLoaded', function () {
    // Initialize with default language (English)
    let currentLang = localStorage.getItem('language') || 'ar';

    // Set initial language
    setLanguage(currentLang);

    // Add event listeners to language buttons
    document.querySelectorAll('.lang-btn').forEach(button => {
        button.addEventListener('click', function () {
            const lang = this.getAttribute('data-lang');
            setLanguage(lang);
            localStorage.setItem('language', lang);

            // Update active button
            document.querySelectorAll('.lang-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
        });
    });

    // Set the active button based on current language
    document.querySelector(`.lang-btn[data-lang="${currentLang}"]`).classList.add('active');
});

function setLanguage(lang) {
    // Set HTML direction for RTL languages
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    // Load translations
    fetch('translations.json')
        .then(response => response.json())
        .then(translations => {
            const langData = translations[lang];

            // Update all elements with data-i18n attribute
            document.querySelectorAll('[data-i18n]').forEach(element => {
                const key = element.getAttribute('data-i18n');
                if (langData[key]) {
                    element.textContent = langData[key];
                }
            });

            // Update placeholder texts
            document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
                const key = element.getAttribute('data-i18n-placeholder');
                if (langData[key]) {
                    element.setAttribute('placeholder', langData[key]);
                }
            });
        })
        .catch(error => console.error('Error loading translations:', error));
}