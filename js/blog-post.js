let translations = {};

function loadTranslations(lang) {
    return fetch('translations.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            translations = data;
            return translations[lang] || translations['en'];
        })
        .catch(error => {
            console.error('Error loading translations:', error);
            return {};
        });
}

document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    const lang = localStorage.getItem('language') || 'en';

    if (!postId) {
        showError();
        return;
    }

    loadTranslations(lang).then(() => {
        applyUITranslations(lang);
        setTextDirection(lang);
        loadBlogPost(postId, lang);
    });
});

function applyUITranslations(lang) {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
}

function setTextDirection(lang) {
    const htmlElement = document.documentElement;
    htmlElement.setAttribute('dir', lang === 'ar' || lang === 'he' ? 'rtl' : 'ltr');
}

function loadBlogPost(postId, lang) {
    const loadingElement = document.getElementById('loading');
    const postElement = document.getElementById('blog-post-content');

    fetch('blog-posts.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const post = data.posts.find(p => p.id == postId);
            if (!post) throw new Error('Post not found');

            const translation = post.translations?.[lang] || {};

            document.title = translation.title || post.title || document.title;
            document.getElementById('post-title').textContent = translation.title || post.title;
            document.getElementById('post-category').textContent = translation.category || post.category;
            document.getElementById('post-date').textContent = formatDate(post.date, lang);
            document.getElementById('post-author').textContent = post.author || 'Admin';
            document.getElementById('post-content').innerHTML = translation.content || post.content;

            // Image Grid Setup
            const images = post.images || [];
            const imageContainer = document.getElementById('post-images');
            imageContainer.innerHTML = '';

            if (images.length > 0) {
                imageContainer.setAttribute('data-image-count', images.length);
                images.forEach(src => {
                    const img = document.createElement('img');
                    img.src = src;
                    img.alt = translation.title || post.title;
                    img.classList.add('gallery-img');
                    img.addEventListener('click', () => openLightbox(src));
                    imageContainer.appendChild(img);
                });
            }

            loadingElement.style.display = 'none';
            postElement.style.display = 'block';
        })
        .catch(error => {
            console.error('Error loading blog post:', error);
            loadingElement.style.display = 'none';
            showError();
        });
}

function formatDate(dateString, lang) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', options);
}

function showError() {
    const errorElement = document.getElementById('error');
    const loadingElement = document.getElementById('loading');
    loadingElement.style.display = 'none';
    errorElement.style.display = 'block';
}

// Handle language switching
document.addEventListener('languageChanged', function (e) {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    const lang = e.detail.lang;

    loadTranslations(lang).then(() => {
        applyUITranslations(lang);
        setTextDirection(lang);
        if (postId) loadBlogPost(postId, lang);
    });
});

// Lightbox functionality
function openLightbox(src) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    lightboxImg.src = src;
    lightbox.style.display = 'flex';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.style.display = 'none';
}
