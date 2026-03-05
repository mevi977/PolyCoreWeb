#!/usr/bin/env python3
"""
Pokreni nakon svakog novog blog posta:
  python3 blog/generate-posts.py

Automatski:
  - uzima hero sliku iz posta (page-hero-bg img src)
  - sinkronizira og:image s hero slikom
  - regenerira posts.json
  - ugrađuje JSON u blog/index.html i sve sidebar skripte
"""
import re, json, glob, os

blog_dir = os.path.dirname(os.path.abspath(__file__))
posts = []

for fpath in sorted(glob.glob(os.path.join(blog_dir, '*.html'))):
    if 'index' in fpath:
        continue
    c = open(fpath).read()

    # Hero slika = slika kartice u indexu
    hero_match = re.search(r'class="page-hero-bg"[^>]*>.*?<img[^>]*src="([^"]*)"', c, re.DOTALL)
    hero_img = hero_match.group(1) if hero_match else ''

    # Automatski popravi og:image da odgovara hero slici
    if hero_img:
        if 'og:image' in c:
            c = re.sub(r'<meta property="og:image" content="[^"]*"',
                       f'<meta property="og:image" content="{hero_img}"', c)
        else:
            c = c.replace('</head>', f'<meta property="og:image" content="{hero_img}"/>\n</head>')
        open(fpath, 'w').write(c)

    def get_meta(name, prop='name'):
        m = re.search(rf'<meta {prop}="{name}" content="([^"]*)"', c)
        return m.group(1) if m else ''

    slug    = '/blog/' + os.path.basename(fpath).replace('.html', '')
    title   = get_meta('og:title', 'property')
    desc    = get_meta('og:description', 'property')
    cat     = get_meta('blog:category')
    rt      = get_meta('blog:readtime')
    date    = get_meta('blog:date')
    dateStr = get_meta('blog:datestr')

    if not title:
        print(f"  ⚠️  Preskačem {os.path.basename(fpath)} – nema og:title")
        continue

    posts.append({'slug': slug, 'title': title, 'desc': desc,
                  'img': hero_img, 'cat': cat, 'rt': rt,
                  'date': date, 'dateStr': dateStr})
    print(f"  ✓ {slug} → {hero_img[-30:] if hero_img else 'NEMA SLIKE!'}")

posts.sort(key=lambda x: x.get('date', ''), reverse=True)

# Spremi posts.json
out_json = os.path.join(blog_dir, 'posts.json')
with open(out_json, 'w', encoding='utf-8') as f:
    json.dump(posts, f, ensure_ascii=False, indent=2)
print(f"\n✅ posts.json – {len(posts)} postova")

posts_inline = json.dumps(posts, ensure_ascii=False)

# Ugradi u index.html
index_path = os.path.join(blog_dir, 'index.html')
c = open(index_path).read()
c = re.sub(r'const ARTICLES = \[.*?\];', f'const ARTICLES = {posts_inline};', c, flags=re.DOTALL)
open(index_path, 'w').write(c)
print("✅ blog/index.html ažuriran")

# Ugradi u sidebar svih postova
for fpath in glob.glob(os.path.join(blog_dir, '*.html')):
    if 'index' in fpath:
        continue
    c = open(fpath).read()
    if 'const posts = [' in c:
        c = re.sub(r'const posts = \[.*?\];', f'const posts = {posts_inline};', c, flags=re.DOTALL)
        open(fpath, 'w').write(c)
        print(f"✅ sidebar – {os.path.basename(fpath)}")

print("\n🎉 Gotovo! git add -A && git commit && git push")
