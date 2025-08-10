/* ===================================================================
 * Infinity - Main JS
 *
 * ------------------------------------------------------------------- */

(function ($) {

	"use strict";

	var cfg = {
		defAnimation: "fadeInUp",    // default css animation		
		scrollDuration: 800,           // smoothscroll duration
		mailChimpURL: 'http://facebook.us8.list-manage.com/subscribe/post?u=cdb7b577e41181934ed6a6a44&amp;id=e65110b38d'
	},

		$WIN = $(window);


	// Add the User Agent to the <html>
	// will be used for IE10 detection (Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0))
	var doc = document.documentElement;
	doc.setAttribute('data-useragent', navigator.userAgent);


	/* Preloader 
	 * -------------------------------------------------- */
	var ssPreloader = function () {

		$WIN.on('load', function () {

			// force page scroll position to top at page refresh
			$('html, body').animate({ scrollTop: 0 }, 'normal');

			// will first fade out the loading animation 
			$("#loader").fadeOut("slow", function () {

				// will fade out the whole DIV that covers the website.
				$("#preloader").delay(300).fadeOut("slow");

			});
		});
	};


	/* FitVids
	------------------------------------------------------ */
	var ssFitVids = function () {
		$(".fluid-video-wrapper").fitVids();
	};


	/*	Masonry
	------------------------------------------------------ */
	var ssMasonryFolio = function () {

		var containerBricks = $('.bricks-wrapper');

		containerBricks.imagesLoaded(function () {
			containerBricks.masonry({
				itemSelector: '.brick',
				resize: true
			});
		});
	};


	/*	Light Gallery
	------------------------------------------------------- */
	var ssLightGallery = function () {

		$('#folio-wrap').lightGallery({
			showThumbByDefault: false,
			hash: false,
			selector: ".item-wrap"
		});
	};


	/* Flexslider
		* ------------------------------------------------------ */
	var ssFlexSlider = function () {

		$WIN.on('load', function () {

			$('#testimonial-slider').flexslider({
				namespace: "flex-",
				controlsContainer: "",
				animation: 'slide',
				controlNav: true,
				directionNav: false,
				smoothHeight: true,
				slideshowSpeed: 7000,
				animationSpeed: 600,
				randomize: false,
				touch: true,
			});

		});

	};


	/* Carousel
* ------------------------------------------------------ */
	var ssOwlCarousel = function () {

		$(".owl-carousel").owlCarousel({
			nav: false,
			loop: true,
			margin: 50,
			responsiveClass: true,
			responsive: {
				0: {
					items: 2,
					margin: 20
				},
				400: {
					items: 3,
					margin: 30
				},
				600: {
					items: 4,
					margin: 40
				},
				1000: {
					items: 6
				}
			}
		});

	};



	/* Menu on Scrolldown
 * ------------------------------------------------------ */
	var ssMenuOnScrolldown = function () {

		var menuTrigger = $('#header-menu-trigger');

		$WIN.on('scroll', function () {

			if ($WIN.scrollTop() > 150) {
				menuTrigger.addClass('opaque');
			}
			else {
				menuTrigger.removeClass('opaque');
			}

		});
	};


	/* OffCanvas Menu
 * ------------------------------------------------------ */
	var ssOffCanvas = function () {

		var menuTrigger = $('#header-menu-trigger'),
			nav = $('#menu-nav-wrap'),
			closeButton = nav.find('.close-button'),
			siteBody = $('body'),
			mainContents = $('section, footer');

		// open-close menu by clicking on the menu icon
		menuTrigger.on('click', function (e) {
			e.preventDefault();
			menuTrigger.toggleClass('is-clicked');
			siteBody.toggleClass('menu-is-open');
		});

		// close menu by clicking the close button
		closeButton.on('click', function (e) {
			e.preventDefault();
			menuTrigger.trigger('click');
		});

		// close menu clicking outside the menu itself
		siteBody.on('click', function (e) {
			if (!$(e.target).is('#menu-nav-wrap, #header-menu-trigger, #header-menu-trigger span')) {
				menuTrigger.removeClass('is-clicked');
				siteBody.removeClass('menu-is-open');
			}
		});

	};


	/* Smooth Scrolling
	  * ------------------------------------------------------ */
	var ssSmoothScroll = function () {

		$('.smoothscroll').on('click', function (e) {
			var target = this.hash,
				$target = $(target);

			e.preventDefault();
			e.stopPropagation();

			$('html, body').stop().animate({
				'scrollTop': $target.offset().top
			}, cfg.scrollDuration, 'swing').promise().done(function () {

				// check if menu is open
				if ($('body').hasClass('menu-is-open')) {
					$('#header-menu-trigger').trigger('click');
				}

				window.location.hash = target;
			});
		});

	};


	/* Placeholder Plugin Settings
	  * ------------------------------------------------------ */
	var ssPlaceholder = function () {
		$('input, textarea, select').placeholder();
	};


	/* Alert Boxes
	------------------------------------------------------- */
	var ssAlertBoxes = function () {

		$('.alert-box').on('click', '.close', function () {
			$(this).parent().fadeOut(500);
		});

	};


	/* Animations
	  * ------------------------------------------------------- */
	var ssAnimations = function () {

		if (!$("html").hasClass('no-cssanimations')) {
			$('.animate-this').waypoint({
				handler: function (direction) {

					var defAnimationEfx = cfg.defAnimation;

					if (direction === 'down' && !$(this.element).hasClass('animated')) {
						$(this.element).addClass('item-animate');

						setTimeout(function () {
							$('body .animate-this.item-animate').each(function (ctr) {
								var el = $(this),
									animationEfx = el.data('animate') || null;

								if (!animationEfx) {
									animationEfx = defAnimationEfx;
								}

								setTimeout(function () {
									el.addClass(animationEfx + ' animated');
									el.removeClass('item-animate');
								}, ctr * 30);

							});
						}, 100);
					}

					// trigger once only
					this.destroy();
				},
				offset: '95%'
			});
		}

	};


	/* Intro Animation
	  * ------------------------------------------------------- */
	var ssIntroAnimation = function () {

		$WIN.on('load', function () {

			if (!$("html").hasClass('no-cssanimations')) {
				setTimeout(function () {
					$('.animate-intro').each(function (ctr) {
						var el = $(this),
							animationEfx = el.data('animate') || null;

						if (!animationEfx) {
							animationEfx = cfg.defAnimation;
						}

						setTimeout(function () {
							el.addClass(animationEfx + ' animated');
						}, ctr * 300);
					});
				}, 100);
			}
		});

	};


	/* Contact Form
	 * ------------------------------------------------------ */
	var ssContactForm = function () {

		/* local validation */
		$('#contactForm').validate({

			/* submit via ajax */
			submitHandler: function (form) {
				var sLoader = $('#submit-loader');

				$.ajax({
					type: "POST",
					url: "inc/sendEmail.php",
					data: $(form).serialize(),

					beforeSend: function () {
						sLoader.fadeIn();
					},
					success: function (msg) {
						// Message was sent
						if (msg == 'OK') {
							sLoader.fadeOut();
							$('#message-warning').hide();
							$('#contactForm').fadeOut();
							$('#message-success').fadeIn();
						}
						// There was an error
						else {
							sLoader.fadeOut();
							$('#message-warning').html(msg);
							$('#message-warning').fadeIn();
						}
					},
					error: function () {
						sLoader.fadeOut();
						$('#message-warning').html("Something went wrong. Please try again.");
						$('#message-warning').fadeIn();
					}
				});
			}

		});
	};


	/* AjaxChimp
	  * ------------------------------------------------------ */
	var ssAjaxChimp = function () {

		$('#mc-form').ajaxChimp({
			language: 'es',
			url: cfg.mailChimpURL
		});

		// Mailchimp translation
		//
		//  Defaults:
		//	 'submit': 'Submitting...',
		//  0: 'We have sent you a confirmation email',
		//  1: 'Please enter a value',
		//  2: 'An email address must contain a single @',
		//  3: 'The domain portion of the email address is invalid (the portion after the @: )',
		//  4: 'The username portion of the email address is invalid (the portion before the @: )',
		//  5: 'This email address looks fake or invalid. Please enter a real email address'

		$.ajaxChimp.translations.es = {
			'submit': 'Submitting...',
			0: '<i class="fa fa-check"></i> We have sent you a confirmation email',
			1: '<i class="fa fa-warning"></i> You must enter a valid e-mail address.',
			2: '<i class="fa fa-warning"></i> E-mail address is not valid.',
			3: '<i class="fa fa-warning"></i> E-mail address is not valid.',
			4: '<i class="fa fa-warning"></i> E-mail address is not valid.',
			5: '<i class="fa fa-warning"></i> E-mail address is not valid.'
		}

	};
	// Product Filter and Modal with Translation Support
	$(document).ready(function () {
		// Initialize with all products showing
		filterProducts('*');

		// Update filter buttons text based on current language
		function updateFilterButtons() {
			const currentLang = localStorage.getItem('language') || 'en';
			$('.products-filter a').each(function () {
				const key = $(this).attr('data-i18n');
				if (key) {
					const translation = translations[currentLang][key] || $(this).text();
					$(this).text(translation);
				}
			});
		}

		// Product Filter
		$('.products-filter a').click(function (e) {
			e.preventDefault();

			// Update active class
			$('.products-filter a').removeClass('current');
			$(this).addClass('current');

			// Get filter value
			var filterValue = $(this).attr('data-filter');

			// Apply filter
			filterProducts(filterValue);
		});

		// Filter function
		function filterProducts(filterValue) {
			var $products = $('.product-card');

			if (filterValue === '*') {
				$products.show();
			} else {
				$products.hide();
				$products.filter(filterValue).show();
			}

			// Scroll to start after filtering
			$('.products-carousel-wrapper').scrollLeft(0);
		}

		// Product Modal Handling with Translation Support
		// $(document).on('click', '.product-card', function () {
		// 	var productId = $(this).data('product');
		// 	const currentLang = localStorage.getItem('language') || 'en';

		// 	// Update modal content based on current language
		// 	const modal = $('#product-modal-' + productId);
		// 	modal.find('[data-i18n]').each(function () {
		// 		const key = $(this).attr('data-i18n');
		// 		if (translations[currentLang][key]) {
		// 			$(this).text(translations[currentLang][key]);
		// 		}
		// 	});

		// 	modal.fadeIn();
		// 	$('body').css('overflow', 'hidden');
		// });

		// $('.product-modal-close').click(function () {
		// 	$(this).closest('.product-modal').fadeOut();
		// 	$('body').css('overflow', 'auto');
		// });

		// // Close modal when clicking outside content
		// $(document).mouseup(function (e) {
		// 	var container = $(".product-modal-content");
		// 	if (!container.is(e.target) && container.has(e.target).length === 0) {
		// 		$('.product-modal').fadeOut();
		// 		$('body').css('overflow', 'auto');
		// 	}
		// });

		// // Close with ESC key
		// $(document).keyup(function (e) {
		// 	if (e.key === "Escape") {
		// 		$('.product-modal').fadeOut();
		// 		$('body').css('overflow', 'auto');
		// 	}
		// });

		// Initialize translations (make sure translations object is available)
		if (typeof translations !== 'undefined') {
			updateFilterButtons();

			// Listen for language changes
			$(document).on('languageChanged', function () {
				updateFilterButtons();
			});
		}
	});


	/* Back to Top
	  * ------------------------------------------------------ */
	var ssBackToTop = function () {

		var pxShow = 500,         // height on which the button will show
			fadeInTime = 400,         // how slow/fast you want the button to show
			fadeOutTime = 400,         // how slow/fast you want the button to hide
			scrollSpeed = 300,         // how slow/fast you want the button to scroll to top. can be a value, 'slow', 'normal' or 'fast'
			goTopButton = $("#go-top")

		// Show or hide the sticky footer button
		$(window).on('scroll', function () {
			if ($(window).scrollTop() >= pxShow) {
				goTopButton.fadeIn(fadeInTime);
			} else {
				goTopButton.fadeOut(fadeOutTime);
			}
		});
	};


	// News Carousel and Modal
	$(document).ready(function () {
		const modal = $("#news-modal");
		const modalContent = $(".news-modal-content");
		const gallery = $("#modal-gallery");

		let previousLang = getCurrentLang();

		// Load and render news
		function loadNewsArticles() {
			const lang = getCurrentLang();

			$.getJSON("news.json", function (data) {
				const carousel = $("#news-carousel");
				carousel.empty();

				const sortedArticles = data.articles.sort((a, b) => new Date(b.date) - new Date(a.date));

				sortedArticles.forEach(article => {
					const t = article.translations[lang] || article.translations["en"];
					const imageSrc = article.images ? article.images[0] : article.image;

					const newsCard = `
					<div class="news-card" data-id="${article.id}">
						<div class="news-card-image">
							<img src="${imageSrc}" alt="${t.title}" loading="lazy">
						</div>
						<div class="news-card-content">
							<span class="news-card-category" style="color: #ff6900;">${t.category}</span>
							<h3 class="news-card-title">${t.title}</h3>
							<span class="news-card-date" style="font-size: small; color: rgb(151, 151, 151);">${formatDate(article.date, lang)}</span>
							<p class="news-card-excerpt" style="display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis;">${t.excerpt}</p>
							<button class="button button-primary" data-i18n="readMore">Read More</button>
						</div>
					</div>
				`;

					carousel.append(newsCard);
				});

				setupNewsModal(data.articles);
			}).fail(function () {
				console.error("Failed to load news data");
				$("#news-carousel").html("<p class='error-message'>News content failed to load. Please try again later.</p>");
			});
		}

		function setupNewsModal(articles) {
			$(document).off("click", ".news-card, .button-primary"); // prevent duplicate binding

			$(document).on("click", ".news-card, .button-primary", function (e) {
				e.stopPropagation();

				const lang = getCurrentLang();
				const card = $(this).closest(".news-card");
				const articleId = card.data("id");
				const article = articles.find(a => a.id == articleId);
				const t = article.translations[lang] || article.translations["en"];

				if (article) {
					gallery.empty();
					const images = article.images || [article.image];

					images.forEach((imgSrc, index) => {
						gallery.append(`<img src="${imgSrc}" alt="${t.title} - Image ${index + 1}" class="gallery-img">`);
					});

					gallery.attr("data-image-count", images.length);
					$("#modal-category").text(t.category).css("color", "#ff6900");
					$("#modal-title").text(t.title);
					$("#modal-date").text(formatDate(article.date, lang));
					$("#modal-content").html(t.content);

					modal.css("display", "flex").hide().fadeIn(300);
					$("body").css("overflow", "hidden");
				}
			});

			$(".news-modal-close").off("click").on("click", closeModal);
			modal.off("click").on("click", function (e) {
				if ($(e.target).is(modal)) closeModal();
			});
			$(document).off("keyup").on("keyup", function (e) {
				if (e.key === "Escape" && modal.is(":visible")) closeModal();
			});
			modalContent.off("click").on("click", function (e) {
				e.stopPropagation();
			});
		}

		function closeModal() {
			$("#news-modal").fadeOut(200, () => {
				$("body").css("overflow", "auto");
			});
		}

		function formatDate(dateString, lang) {
			const options = { year: 'numeric', month: 'long', day: 'numeric' };
			return new Date(dateString).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', options);
		}

		function getCurrentLang() {
			return localStorage.getItem("language") || "en";
		}

		// ✅ Check if language has changed every 500ms
		setInterval(() => {
			const currentLang = getCurrentLang();
			if (currentLang !== previousLang) {
				previousLang = currentLang;
				loadNewsArticles(); // re-render cards when language changes
			}
		}, 500);

		// 🔄 Initial render
		loadNewsArticles();
	});



	// Whatsapp bubble
	document.addEventListener('DOMContentLoaded', function () {
		const socialBubbles = document.querySelector('.social-bubbles');
		const homeSection = document.getElementById('home');

		function checkVisibility() {
			if (!homeSection) {
				socialBubbles.classList.add('visible');
				return;
			}

			const homeHeight = homeSection.offsetHeight;
			const scrolled = window.scrollY;

			if (scrolled > homeHeight * 0.8) {
				socialBubbles.classList.add('visible');
			} else {
				socialBubbles.classList.remove('visible');
			}
		}

		// Initial check
		checkVisibility();

		// Scroll event with throttling
		let isScrolling;
		window.addEventListener('scroll', function () {
			clearTimeout(isScrolling);
			isScrolling = setTimeout(checkVisibility, 50);
		});

		// Optional: Click handler for testing
		socialBubbles.addEventListener('click', function (e) {
			if (e.target === socialBubbles) {
				// If clicking the container itself
				window.open('https://wa.me/+201060274759', '_blank');
			}
		});
	});


	// blog posts
	// blog-section.js

	// Load and display blog posts with translations
	// blog-section.js

	document.addEventListener('DOMContentLoaded', function () {
		let currentLang = localStorage.getItem('language') || 'en';

		// Load blog posts on page load
		loadBlogPosts(currentLang);

		// Listen for language changes
		document.querySelectorAll('.lang-btn').forEach(button => {
			button.addEventListener('click', function () {
				const lang = this.getAttribute('data-lang');
				localStorage.setItem('language', lang);
				loadBlogPosts(lang);
			});
		});

		function loadBlogPosts(lang) {
			fetch('blog-posts.json')
				.then(response => response.json())
				.then(data => {
					const blogGrid = document.getElementById('blog-grid');
					blogGrid.innerHTML = '';

					// Sort by date (newest first)
					const sortedPosts = data.posts.sort((a, b) => new Date(b.date) - new Date(a.date));
					const recentPosts = sortedPosts.slice(0, 3);

					recentPosts.forEach(post => {
						const t = post.translations && post.translations[lang] ? post.translations[lang] : {};

						const blogCard = document.createElement('article');
						blogCard.className = 'blog-card';

						blogCard.innerHTML = `
						<div class="blog-card-image">
							<img src="${(post.images && post.images[0])}" alt="${t.title || post.title}">
						</div>
						<div class="blog-card-content">
							<span class="blog-card-date">${formatDate(post.date, lang)}</span>
							<h3 class="blog-card-title">${t.title || post.title}</h3>
							<p class="blog-card-excerpt">${t.excerpt || post.excerpt}</p>
							<a href="${post.url}" class="button button-primary blog-post-link" data-i18n="readMore" target="_blank">${getTranslatedText('readMore', lang)}</a>
						</div>
					`;

						blogGrid.appendChild(blogCard);
					});
				})
				.catch(error => {
					console.error('Failed to load blog posts:', error);
					document.getElementById('blog-grid').innerHTML = '<p class="error-message">Failed to load blog posts.</p>';
				});
		}

		function formatDate(dateString, lang) {
			const options = { year: 'numeric', month: 'long', day: 'numeric' };
			return new Date(dateString).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', options);
		}

		function getTranslatedText(key, lang) {
			const translations = {
				readMore: {
					en: 'Read More',
					ar: 'اقرأ المزيد'
				}
			};
			return translations[key] && translations[key][lang] ? translations[key][lang] : translations[key]['en'];
		}
	});


	/* Initialize
	  * ------------------------------------------------------ */
	(function ssInit() {

		ssPreloader();
		ssFitVids();
		ssMasonryFolio();
		ssLightGallery();
		ssFlexSlider();
		ssOwlCarousel();
		ssMenuOnScrolldown();
		ssOffCanvas();
		ssSmoothScroll();
		ssPlaceholder();
		ssAlertBoxes();
		ssAnimations();
		ssIntroAnimation();
		ssContactForm();
		ssAjaxChimp();
		ssBackToTop();

	})();


})(jQuery);