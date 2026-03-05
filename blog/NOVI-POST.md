# Kako dodati novi blog post

## 1. Kopiraj template
Kopiraj bilo koji postojeći blog post (npr. `feuchter-keller-loesungen.html`)
i preimenuj ga u URL-friendly naziv, npr. `epoxidharz-garagen-boden.html`

## 2. Promijeni meta tagove u <head>

### Obavezni za automatsko učitavanje:
```html
<meta property="og:title" content="NASLOV CLANKA"/>
<meta property="og:description" content="OPIS (1-2 recenice)"/>
<meta property="og:image" content="URL_HERO_SLIKE"/>
<meta name="blog:category" content="Epoxidharz"/>  <!-- kategorija -->
<meta name="blog:readtime" content="5"/>            <!-- minuta citanja -->
<meta name="blog:date" content="2026-04-01"/>       <!-- ISO format -->
<meta name="blog:datestr" content="1. April 2026"/> <!-- prikaz -->
```

## 3. Promijeni hero sliku
```html
<div class="page-hero-bg">
  <img src="URL_TVOJE_SLIKE" .../>
</div>
```
⚠️ Ista slika kao og:image gore – ona se prikazuje u indexu!

## 4. Napiši sadržaj u <article class="article-body">

## 5. Regeneriraj posts.json
Pokreni u terminalu iz `PolyCoreWeb/` foldera:
```bash
python3 blog/generate-posts.py
```
Blog index i sidebar se automatski ažuriraju!

