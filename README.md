# Art by Stage - Kunstner Website

Et elegant og responsivt kunstner-website bygget med HTML, CSS og vanilla JavaScript. Websitet præsenterer abstrakt og naturalistisk kunst med dynamisk indlæsning af kunstværker fra JSON-data.

## Funktioner

- **Hero Slideshow**: Automatisk skiftende slideshow af dine 4 seneste værker (5 sek. interval, pauses på hover)
- **Responsive Design**: Fungerer perfekt på desktop, tablet og mobil
- **Dynamiske Detalje-sider**: Hver kunstværk har sin egen dynamisk genereret detalje-side
- **Gallery**: Kortbaseret visning af alle kunstværker
- **JSON-data**: Alle kunstværker hentes fra `data/artworks.json` - nemt at opdatere
- **Netlify Forms**: Kontaktformularer sender emails direkte til dig
- **Slug-baserede URLs**: Pæne URLs baseret på kunstværkets titel (f.eks. `/detail.html?slug=naturens-flow`)

## Mappestruktur

```
artbystage2/
├── index.html                    # Forside
├── pages/
│   ├── gallery.html             # Galleri med alle værker
│   ├── detail.html              # Detalje-side for enkelt værk
│   ├── about.html               # Om kunstneren
│   ├── contact.html             # Kontaktformular
│   └── shipping.html            # Leveringsbetingelser
├── css/
│   └── style.css                # Alle styles
├── js/
│   └── main.js                  # JavaScript-funktionalitet
├── data/
│   └── artworks.json            # Kunstværk-data
├── images/
│   └── artworks/                # Billeder af kunstværker
├── .gitignore                   # Git-ignorfil
└── README.md                    # Denne fil
```

## Installation & Setup

### Forudsætninger
- GitHub-konto
- Netlify-konto (gratis)
- Git installeret på din computer
- En teksteditor (VS Code anbefales)

### Trin 1: Klone Repository

```bash
git clone https://github.com/[dit-brugernavn]/artbystage2.git
cd artbystage2
```

### Trin 2: Tilføj Billeder

1. Opret billede-filer med samme navn som i `data/artworks.json`
2. Læg dem i mappen `images/artworks/`

**Eksempel fra JSON:**
```json
"images": ["naturens-flow-1.jpg", "naturens-flow-2.jpg"]
```

Disse billeder skal ligge i `images/artworks/`

### Trin 3: Rediger Kunstværker-data

Åbn `data/artworks.json` og opdater med dine kunstværker:

```json
{
  "id": 1,
  "title": "Dit Kunstværk",
  "slug": "dit-kunstvaerk",
  "shortDescription": "Kort beskrivelse",
  "longDescription": "Længere beskrivelse",
  "dimensions": "80 x 120 cm",
  "type": "Akryl på lærred",
  "price": 4500,
  "images": ["billede1.jpg", "billede2.jpg"],
  "featured": true
}
```

### Trin 4: Deploy til Netlify

1. Push til GitHub
2. Log ind på [Netlify.com](https://netlify.com)
3. Klik "New site from Git"
4. Vælg dit GitHub-repository
5. Netlify deployer automatisk!

### Trin 5: Knyt domæne

1. I Netlify-dashboard: Domain Settings
2. Tilføj dit domæne `artbystage.dk`
3. Følg instruktionerne for DNS-opsætning

## Brugeroplevelse

### Besøgende
1. Ser hero-slideshow på forsiden
2. Kan se galleri med alle værker
3. Kan klikke på værk for at se detaljer
4. Kan sende forespørgsel på værk fra detalje-siden
5. Kan kontakte kunstneren via kontakt-siden

### Kunstner (dig)
1. Du modtager emails når nogen sender forespørgsel
2. Du kan nemt opdatere kunstværker ved at redigere `data/artworks.json`
3. Du pusher ændringerne til GitHub
4. Netlify deployer automatisk - ingen manuel handling nødvendig!

## Netlify Forms Opsætning

Kontaktformularer bruges automatisk når siden deployes på Netlify. Du behøver ikke at gøre noget!

- Svarene får du som emails til `artbystage@gmail.com` (konfigureret i Netlify-dashboard)
- Forespørgsler på kunstværker kommer også dertil med værk-info pre-fyldt

## Tilpassninger

### Rediger Kunstner-bio
- Åbn `pages/about.html` og rediger HTML direkte

### Rediger Leveringsbetingelser
- Åbn `pages/shipping.html` og rediger HTML direkte

### Rediger Farverne
Se `:root` variablerne i `css/style.css`:
```css
--primary-color: #2c3e50;     /* Mørkeblå */
--secondary-color: #27ae60;   /* Grøn */
--accent-color: #e74c3c;      /* Rød */
```

## Browser-understøttelse

- Chrome (seneste)
- Firefox (seneste)
- Safari (seneste)
- Edge (seneste)

## Teknologier Brugt

- HTML5
- CSS3
- Vanilla JavaScript (ingen biblioteker)
- Netlify (hosting & forms)
- GitHub (version control)

## Support & Spørgsmål

Hvis du har spørgsmål, kontakt mig via websitet eller artbystage@gmail.com

---

**Art by Stage** © 2026. Alle rettigheder forbeholdt.
