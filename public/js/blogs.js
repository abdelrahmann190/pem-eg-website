let translations = {};

// Load translations first
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
    const lang = localStorage.getItem('language') || 'en';

    // First load translations, then blog posts
    loadTranslations(lang).then(() => {
        // Apply UI translations
        applyUITranslations(lang);

        // Set text direction (LTR or RTL)
        setTextDirection(lang);

        // Then load blog posts
        loadBlogPosts(lang);
    });

    // Listen for language changes
    document.addEventListener('languageChanged', function (e) {
        const newLang = e.detail.lang;
        loadTranslations(newLang).then(() => {
            applyUITranslations(newLang);
            setTextDirection(newLang);  // Change text direction
            loadBlogPosts(newLang);
        });
    });
});

function applyUITranslations(lang) {
    // Translate all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
}

// Function to set text direction based on language
function setTextDirection(lang) {
    const htmlElement = document.documentElement;

    if (lang === 'ar' || lang === 'he') {
        htmlElement.setAttribute('dir', 'rtl');  // Right to left
    } else {
        htmlElement.setAttribute('dir', 'ltr');  // Left to right
    }
}

function loadBlogPosts(lang) {
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');
    const blogGrid = document.getElementById('blog-grid');
    const noArticlesElement = document.getElementById('no-articles');

    // Show loading
    loadingElement.style.display = 'block';
    errorElement.style.display = 'none';
    blogGrid.innerHTML = '';

    fetch('blog-posts.json')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            loadingElement.style.display = 'none';

            if (!data.posts || data.posts.length === 0) {
                noArticlesElement.style.display = 'block';
                return;
            }

            displayBlogPosts(data.posts, lang);
            setupCategoryFilter(data.posts, lang);
        })
        .catch(error => {
            console.error('Fetch failed:', error);
            showError(`Error loading blog posts: ${error.message}`);
        });
}

function displayBlogPosts(posts, lang) {
    const blogGrid = document.getElementById('blog-grid');
    const readMoreText = translations[lang]?.readMore || "Read More";

    blogGrid.innerHTML = '';

    const sortedPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));

    sortedPosts.forEach(post => {
        const translation = post.translations?.[lang] || {};
        const title = translation.title || post.title;
        const excerpt = translation.excerpt || post.excerpt || '';
        const category = translation.category || post.category;

        const postElement = document.createElement('article');
        postElement.className = 'blog-card';
        postElement.innerHTML = `
            <div class="blog-card-image">
            <img src="${(post.images && post.images[0]) || 'images/blog/default.jpg'}" alt="${title}" loading="lazy">
            </div>
            <div class="blog-card-content">
            <span class="blog-card-category">${category}</span>
            <h3 class="blog-card-title">${title}</h3>
            <div class="blog-card-meta">
                <span class="blog-card-date">${formatDate(post.date, lang)}</span>
                <span class="blog-card-author">${post.author || 'Admin'}</span>
            </div>
            <p class="blog-card-excerpt">${excerpt}</p>
            <a href="blog-post.html?id=${post.id}" class="button" data-i18n="readMore">${readMoreText}</a>
            </div>
        `;
        blogGrid.appendChild(postElement);
    });
}

function setupCategoryFilter(posts, lang) {
    const categoryFilter = document.getElementById('category-filter');
    const allCategoriesText = translations[lang]?.allCategories || "All Categories";

    const categories = [...new Set(posts.map(post => {
        const translation = post.translations?.[lang];
        return translation?.category || post.category;
    }))];

    // Clear old options except first
    while (categoryFilter.options.length > 1) {
        categoryFilter.remove(1);
    }

    // Add categories
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    // Add filter logic
    categoryFilter.onchange = function () {
        filterBlogPosts(this.value, lang);
    };
}

function filterBlogPosts(category, lang) {
    const allPosts = document.querySelectorAll('.blog-card');
    const noArticlesElement = document.getElementById('no-articles');
    let visiblePosts = 0;

    allPosts.forEach(post => {
        const postCategory = post.querySelector('.blog-card-category').textContent;
        const show = (category === 'all' || postCategory === category);
        post.style.display = show ? 'block' : 'none';
        if (show) visiblePosts++;
    });

    noArticlesElement.style.display = visiblePosts === 0 ? 'block' : 'none';
}

function formatDate(dateString, lang) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', options);
}

function showError(message) {
    const errorElement = document.getElementById('error');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}
