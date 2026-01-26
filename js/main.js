// ==================== Global Variables ====================

let artworks = [];
let currentSlide = 0;
let slideshowInterval = null;

// ==================== Mobile Menu Functionality ====================

function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const closeBtn = document.getElementById('closeBtn');
    const mobileMenuHeader = document.querySelector('.mobile-menu-header');

    if (!hamburger || !navMenu) return;

    // Toggle menu on hamburger click
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        if (mobileMenuHeader) {
            mobileMenuHeader.classList.toggle('active');
        }
    });

    // Close menu on close button click
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            if (mobileMenuHeader) {
                mobileMenuHeader.classList.remove('active');
            }
        });
    }

    // Close menu when a link is clicked
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            if (mobileMenuHeader) {
                mobileMenuHeader.classList.remove('active');
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            if (mobileMenuHeader) {
                mobileMenuHeader.classList.remove('active');
            }
        }
    });
}

// ==================== Initialize ====================

document.addEventListener('DOMContentLoaded', async () => {
    // Initialize mobile menu
    initMobileMenu();

    // Load artworks data
    await loadArtworks();
    
    // Wait a bit to ensure artworks are loaded
    setTimeout(() => {
        // Initialize components based on current page
        const path = window.location.pathname;
        
        if (path.includes('index') || path.endsWith('/') || path.endsWith('/artbystage2/')) {
            initHeroSlideshow();
            loadFeaturedArtworks();
        } else if (path.includes('gallery')) {
            loadGallery();
        } else if (path.includes('detail')) {
            loadArtworkDetail();
        }
    }, 100);
});

// ==================== Load Artworks ====================

async function loadArtworks() {
    try {
        // Detect if we're on a pages/ subdirectory
        const isSubpage = window.location.pathname.includes('/pages/');
        const jsonPath = isSubpage ? '../data/artworks.json' : './data/artworks.json';
        
        const response = await fetch(jsonPath);
        artworks = await response.json();
    } catch (error) {
        console.error('Error loading artworks:', error);
        artworks = [];
    }
}

// ==================== Hero Slideshow ====================

function initHeroSlideshow() {
    const heroSlides = document.getElementById('heroSlides');
    if (!heroSlides) return;

    // Get featured artworks for slideshow
    const featuredForSlideshow = artworks.filter(art => art.featured);

    // Create slides
    featuredForSlideshow.forEach((artwork, index) => {
        const slide = document.createElement('div');
        slide.className = `slide ${index === 0 ? 'active' : ''}`;
        
        const img = document.createElement('img');
        const basePath = window.location.pathname.includes('/pages/') ? '../images/artworks/' : './images/artworks/';
        img.src = basePath + artwork.images[0];
        img.alt = artwork.title;
        
        slide.appendChild(img);
        heroSlides.appendChild(slide);
    });

    // Create indicators
    const slideIndicators = document.getElementById('slideIndicators');
    featuredForSlideshow.forEach((artwork, index) => {
        const indicator = document.createElement('div');
        indicator.className = `indicator ${index === 0 ? 'active' : ''}`;
        indicator.addEventListener('click', () => goToSlide(index, featuredForSlideshow));
        slideIndicators.appendChild(indicator);
    });

    // Add slide number display
    const slideNumber = document.createElement('span');
    slideNumber.className = 'slide-number';
    slideNumber.id = 'slideNumber';
    slideNumber.textContent = `0${currentSlide + 1}`;
    slideIndicators.appendChild(slideNumber);

    // Update hero text with first artwork
    updateHeroText(featuredForSlideshow[0]);

    // Button listeners
    document.getElementById('prevBtn').addEventListener('click', () => prevSlide(featuredForSlideshow));
    document.getElementById('nextBtn').addEventListener('click', () => nextSlide(featuredForSlideshow));

    // Start slideshow
    startSlideshow(featuredForSlideshow);

    // Handle hover pause/resume
    const heroSlideshow = document.getElementById('heroSlideshow');
    if (heroSlideshow) {
        heroSlideshow.addEventListener('mouseenter', pauseSlideshow);
        heroSlideshow.addEventListener('mouseleave', () => startSlideshow(featuredForSlideshow));
    }
}

function updateHeroText(artwork) {
    const heroTitle = document.getElementById('heroTitle');
    const heroSubtitle = document.getElementById('heroSubtitle');
    if (heroTitle && heroSubtitle) {
        heroTitle.textContent = artwork.title;
        heroSubtitle.textContent = artwork.shortDescription;
    }
}

function startSlideshow(slides) {
    // Clear existing interval
    if (slideshowInterval) {
        clearInterval(slideshowInterval);
    }

    // Set up new interval
    slideshowInterval = setInterval(() => {
        nextSlide(slides);
    }, 5000);
}

function nextSlide(slides) {
    const slideElements = document.querySelectorAll('.slide');
    if (slideElements.length === 0) return;

    slideElements[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slideElements.length;
    slideElements[currentSlide].classList.add('active');

    updateIndicators();
    updateHeroText(slides[currentSlide]);
}

function prevSlide(slides) {
    const slideElements = document.querySelectorAll('.slide');
    if (slideElements.length === 0) return;

    slideElements[currentSlide].classList.remove('active');
    currentSlide = (currentSlide - 1 + slideElements.length) % slideElements.length;
    slideElements[currentSlide].classList.add('active');

    updateIndicators();
    updateHeroText(slides[currentSlide]);
}

function goToSlide(index, slides) {
    const slideElements = document.querySelectorAll('.slide');
    slideElements[currentSlide].classList.remove('active');
    currentSlide = index;
    slideElements[currentSlide].classList.add('active');

    updateIndicators();
    updateHeroText(slides[currentSlide]);
    
    // Restart slideshow timer
    pauseSlideshow();
    startSlideshow(slides);
}

function updateIndicators() {
    const indicators = document.querySelectorAll('.indicator');
    const slideNumber = document.getElementById('slideNumber');
    
    indicators.forEach((indicator, index) => {
        if (index === currentSlide) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });

    if (slideNumber) {
        slideNumber.textContent = `0${currentSlide + 1}`;
    }
}

function pauseSlideshow() {
    if (slideshowInterval) {
        clearInterval(slideshowInterval);
        slideshowInterval = null;
    }
}

// ==================== Featured Artworks (Home Page) ====================

function loadFeaturedArtworks() {
    const featuredContainer = document.getElementById('featuredArtworks');
    if (!featuredContainer) return;

    // Get featured artworks
    const featured = artworks.filter(art => art.featured);

    featured.forEach(artwork => {
        const card = createArtworkCard(artwork);
        featuredContainer.appendChild(card);
    });
}

// ==================== Gallery ====================

function loadGallery() {
    const galleryGrid = document.getElementById('galleryGrid');
    const filterButtons = document.getElementById('filterButtons');
    if (!galleryGrid) return;

    // Get unique types for filter buttons
    const uniqueTypes = [...new Set(artworks.map(art => art.type))];
    
    // Create filter buttons
    if (filterButtons) {
        // Add "All" button
        const allBtn = document.createElement('button');
        allBtn.className = 'filter-btn active';
        allBtn.textContent = 'Alle';
        allBtn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            allBtn.classList.add('active');
            displayGallery(artworks);
        });
        filterButtons.appendChild(allBtn);

        // Add type buttons
        uniqueTypes.forEach(type => {
            const btn = document.createElement('button');
            btn.className = 'filter-btn';
            btn.textContent = type;
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filtered = artworks.filter(art => art.type === type);
                displayGallery(filtered);
            });
            filterButtons.appendChild(btn);
        });
    }

    // Display all artworks initially
    displayGallery(artworks);
}

function displayGallery(artworksToDisplay) {
    const galleryGrid = document.getElementById('galleryGrid');
    galleryGrid.innerHTML = ''; // Clear grid
    
    artworksToDisplay.forEach(artwork => {
        const card = createArtworkCard(artwork);
        galleryGrid.appendChild(card);
    });
}

// ==================== Create Artwork Card ====================

function createArtworkCard(artwork) {
    const card = document.createElement('div');
    card.className = 'artwork-card';
    
    // Add sold class if artwork is sold
    if (artwork.sold) {
        card.classList.add('sold');
    }

    const imageDiv = document.createElement('div');
    imageDiv.className = 'artwork-image';
    
    const img = document.createElement('img');
    // Detect if we're on a pages/ subdirectory
    const isSubpage = window.location.pathname.includes('/pages/');
    const basePath = isSubpage ? '../images/artworks/' : './images/artworks/';
    img.src = basePath + artwork.images[0];
    img.alt = artwork.title;
    
    imageDiv.appendChild(img);

    // Add sold label if artwork is sold
    if (artwork.sold) {
        const soldLabel = document.createElement('div');
        soldLabel.className = 'sold-label';
        soldLabel.textContent = 'Solgt!';
        imageDiv.appendChild(soldLabel);
    }

    const infoDiv = document.createElement('div');
    infoDiv.className = 'artwork-info';

    const title = document.createElement('h3');
    title.textContent = artwork.title;

    // Add type/medium
    const typeSpan = document.createElement('p');
    typeSpan.style.fontSize = '0.85rem';
    typeSpan.style.color = '#888';
    typeSpan.style.marginBottom = '0.5rem';
    typeSpan.textContent = artwork.type;

    const description = document.createElement('p');
    description.textContent = artwork.shortDescription;

    const metaDiv = document.createElement('div');
    metaDiv.className = 'artwork-meta';

    const type = document.createElement('span');
    type.className = 'artwork-type';
    type.textContent = artwork.type;

    const price = document.createElement('span');
    price.className = 'artwork-price';
    price.textContent = `${artwork.price.toLocaleString('da-DK')} kr.`;

    metaDiv.appendChild(type);
    metaDiv.appendChild(price);

    infoDiv.appendChild(title);
    infoDiv.appendChild(typeSpan);
    infoDiv.appendChild(description);
    infoDiv.appendChild(metaDiv);

    card.appendChild(imageDiv);
    card.appendChild(infoDiv);

    // Click to go to detail page
    card.addEventListener('click', () => {
        const isSubpage = window.location.pathname.includes('/pages/');
        const detailPath = isSubpage ? `detail.html?slug=${artwork.slug}` : `pages/detail.html?slug=${artwork.slug}`;
        window.location.href = detailPath;
    });

    return card;
}

// ==================== Artwork Detail Page ====================

function loadArtworkDetail() {
    const detailWrapper = document.getElementById('detailWrapper');
    if (!detailWrapper) return;

    // Get slug from URL
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug');

    // Find artwork
    const artwork = artworks.find(art => art.slug === slug);

    if (!artwork) {
        detailWrapper.innerHTML = '<p>Værk ikke fundet.</p>';
        return;
    }

    // Update page title
    document.title = `${artwork.title} - Art by Stage`;

    // Create detail content
    const detailContent = document.createElement('div');
    detailContent.className = 'detail-content';

    // Images section
    const imagesDiv = document.createElement('div');
    imagesDiv.className = 'detail-images';

    const mainImageDiv = document.createElement('div');
    mainImageDiv.className = 'main-image';
    mainImageDiv.style.position = 'relative';
    const mainImg = document.createElement('img');
    mainImg.id = 'mainImage';
    const basePath = window.location.pathname.includes('/pages/') ? '../images/artworks/' : './images/artworks/';
    mainImg.src = basePath + artwork.images[0];
    mainImg.alt = artwork.title;
    mainImageDiv.appendChild(mainImg);

    // Add sold label if artwork is sold
    if (artwork.sold) {
        const soldLabel = document.createElement('div');
        soldLabel.className = 'sold-label';
        soldLabel.textContent = 'Solgt!';
        mainImageDiv.appendChild(soldLabel);
    }

    imagesDiv.appendChild(mainImageDiv);

    // Thumbnails
    if (artwork.images.length > 1) {
        const thumbnailDiv = document.createElement('div');
        thumbnailDiv.className = 'thumbnail-images';

        artwork.images.forEach((image, index) => {
            const thumb = document.createElement('div');
            thumb.className = `thumbnail ${index === 0 ? 'active' : ''}`;

            const thumbImg = document.createElement('img');
            thumbImg.src = basePath + image;
            thumbImg.alt = `${artwork.title} thumbnail ${index + 1}`;

            thumb.appendChild(thumbImg);

            thumb.addEventListener('click', () => {
                // Update active thumbnail
                document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');

                // Update main image
                document.getElementById('mainImage').src = basePath + image;
            });

            thumbnailDiv.appendChild(thumb);
        });

        imagesDiv.appendChild(thumbnailDiv);
    }

    // Info section
    const infoDiv = document.createElement('div');
    infoDiv.className = 'detail-info';

    const title = document.createElement('h1');
    title.textContent = artwork.title;

    // Add type/medium
    const typeInfo = document.createElement('p');
    typeInfo.style.fontSize = '1rem';
    typeInfo.style.color = '#888';
    typeInfo.style.marginBottom = '1rem';
    typeInfo.style.letterSpacing = '1px';
    typeInfo.textContent = artwork.type.toUpperCase();

    const price = document.createElement('div');
    price.className = 'detail-price';
    price.textContent = `${artwork.price.toLocaleString('da-DK')} kr.`;

    const specsDiv = document.createElement('div');
    specsDiv.className = 'detail-specs';
    specsDiv.innerHTML = `
        <p><strong>Mål:</strong> ${artwork.dimensions}</p>
        <p><strong>Type:</strong> ${artwork.type}</p>
    `;

    const description = document.createElement('p');
    description.className = 'detail-description';
    description.textContent = artwork.longDescription;

    // Inquiry form
    const inquiryForm = document.createElement('form');
    inquiryForm.className = 'contact-form inquiry-form';
    inquiryForm.setAttribute('name', 'inquiry');
    inquiryForm.setAttribute('method', 'POST');
    inquiryForm.setAttribute('netlify', 'true');

    inquiryForm.innerHTML = `
        <h3>Send Forespørgsel</h3>
        
        <input type="hidden" name="form-name" value="inquiry">
        <input type="hidden" name="artwork" value="${artwork.title}">
        <input type="hidden" name="price" value="${artwork.price}">
        
        <div class="form-group">
            <label for="name">Navn</label>
            <input type="text" id="name" name="name" required>
        </div>

        <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required>
        </div>

        <div class="form-group">
            <label for="message">Besked</label>
            <textarea id="message" name="message" rows="4" placeholder="Skriv dine spørgsmål her..."></textarea>
        </div>

        <button type="submit" class="submit-button">Send Forespørgsel</button>
    `;

    infoDiv.appendChild(title);
    infoDiv.appendChild(typeInfo);
    infoDiv.appendChild(price);
    infoDiv.appendChild(specsDiv);
    infoDiv.appendChild(description);
    infoDiv.appendChild(inquiryForm);

    detailContent.appendChild(imagesDiv);
    detailContent.appendChild(infoDiv);

    detailWrapper.appendChild(detailContent);
}

// ==================== Active Navigation Link ====================

document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;
    const navBar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    // Add navbar-home class on home page
    if (currentPath.includes('index.html') || currentPath.endsWith('/') || currentPath.endsWith('/artbystage2/')) {
        navBar.classList.add('navbar-home');
    }

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        // Check if this link matches current page
        if (currentPath.includes(href) || 
            (currentPath.endsWith('/') && href.includes('index.html')) ||
            (currentPath.endsWith('/artbystage2/') && href.includes('index.html'))) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});
