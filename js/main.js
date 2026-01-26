// ==================== Global Variables ====================

let artworks = [];
let currentSlide = 0;
let slideshowInterval = null;

// ==================== Initialize ====================

document.addEventListener('DOMContentLoaded', async () => {
    // Load artworks data
    await loadArtworks();
    
    // Initialize components based on current page
    const path = window.location.pathname;
    
    if (path.includes('index.html') || path.endsWith('/')) {
        initHeroSlideshow();
        loadFeaturedArtworks();
    } else if (path.includes('gallery.html')) {
        loadGallery();
    } else if (path.includes('detail.html')) {
        loadArtworkDetail();
    }
});

// ==================== Load Artworks ====================

async function loadArtworks() {
    try {
        const response = await fetch('./data/artworks.json');
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

    // Get the 4 most recent artworks (indices 4-7)
    const featuredForSlideshow = artworks.slice(-4).reverse();

    // Create slides
    featuredForSlideshow.forEach((artwork, index) => {
        const slide = document.createElement('div');
        slide.className = `slide ${index === 0 ? 'active' : ''}`;
        
        const img = document.createElement('img');
        img.src = `./images/artworks/${artwork.images[0]}`;
        img.alt = artwork.title;
        
        slide.appendChild(img);
        heroSlides.appendChild(slide);
    });

    // Start slideshow
    startSlideshow();

    // Handle hover pause/resume
    const heroSlideshow = document.getElementById('heroSlideshow');
    if (heroSlideshow) {
        heroSlideshow.addEventListener('mouseenter', pauseSlideshow);
        heroSlideshow.addEventListener('mouseleave', startSlideshow);
    }
}

function startSlideshow() {
    // Clear existing interval
    if (slideshowInterval) {
        clearInterval(slideshowInterval);
    }

    // Set up new interval
    slideshowInterval = setInterval(() => {
        nextSlide();
    }, 5000);
}

function pauseSlideshow() {
    if (slideshowInterval) {
        clearInterval(slideshowInterval);
        slideshowInterval = null;
    }
}

function nextSlide() {
    const slides = document.querySelectorAll('.slide');
    if (slides.length === 0) return;

    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
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
    if (!galleryGrid) return;

    artworks.forEach(artwork => {
        const card = createArtworkCard(artwork);
        galleryGrid.appendChild(card);
    });
}

// ==================== Create Artwork Card ====================

function createArtworkCard(artwork) {
    const card = document.createElement('div');
    card.className = 'artwork-card';

    const imageDiv = document.createElement('div');
    imageDiv.className = 'artwork-image';
    
    const img = document.createElement('img');
    img.src = `./images/artworks/${artwork.images[0]}`;
    img.alt = artwork.title;
    
    imageDiv.appendChild(img);

    const infoDiv = document.createElement('div');
    infoDiv.className = 'artwork-info';

    const title = document.createElement('h3');
    title.textContent = artwork.title;

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
    infoDiv.appendChild(description);
    infoDiv.appendChild(metaDiv);

    card.appendChild(imageDiv);
    card.appendChild(infoDiv);

    // Click to go to detail page
    card.addEventListener('click', () => {
        window.location.href = `detail.html?slug=${artwork.slug}`;
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
    const mainImg = document.createElement('img');
    mainImg.id = 'mainImage';
    mainImg.src = `./images/artworks/${artwork.images[0]}`;
    mainImg.alt = artwork.title;
    mainImageDiv.appendChild(mainImg);

    imagesDiv.appendChild(mainImageDiv);

    // Thumbnails
    if (artwork.images.length > 1) {
        const thumbnailDiv = document.createElement('div');
        thumbnailDiv.className = 'thumbnail-images';

        artwork.images.forEach((image, index) => {
            const thumb = document.createElement('div');
            thumb.className = `thumbnail ${index === 0 ? 'active' : ''}`;

            const thumbImg = document.createElement('img');
            thumbImg.src = `./images/artworks/${image}`;
            thumbImg.alt = `${artwork.title} thumbnail ${index + 1}`;

            thumb.appendChild(thumbImg);

            thumb.addEventListener('click', () => {
                // Update active thumbnail
                document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');

                // Update main image
                document.getElementById('mainImage').src = `./images/artworks/${image}`;
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
    const navLinks = document.querySelectorAll('.nav-link');

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
