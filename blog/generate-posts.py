#!/usr/bin/env python3
"""
Pokreni nakon svakog novog blog posta:
  python3 blog/generate-posts.py

Što radi:
  1. Čita meta tagove iz svih blog postova
  2. Regenerira posts.json
  3. Ugrađuje JSON direktno u blog/index.html i sve sidebar skripte
"""
import re, json, glob, os

blog_dir = os.path.dirname(os.path.abspath(__file__))

# --- 1. Skupi sve postove ---
posts = []
for fpath in sorted(glob.glob(os.path.join(blog_dir, '*.html'))):
    if 'index' in fpath:
        continue
    c = open(fpath).read()

    def get_meta(name, prop='name'):
        m = re.search(rf'<meta {prop}="{name}" content="([^"]*)"', c)
        return m.group(1) if m else ''

    slug = '/blog/' + os.path.basename(fpath).replace('.html', '')
    title   = get_meta('og:title', 'property')
    desc    = get_meta('og:description', 'property')
    img     = get_meta('og:image', 'property')
    cat     = get_meta('blog:category')
    rt      = get_meta('blog:readtime')
    date    = get_meta('blog:date')
    dateStr = get_meta('blog:datestr')

    if not title:
        print(f"  ⚠️  Preskačem {os.path.basename(fpath)} – nema og:title")
        continue

    posts.append({'slug': slug, 'title': title, 'desc': desc,
                  'img': img, 'cat': cat, 'rt': rt,
                  'date': date, 'dateStr': dateStr})
    print(f"  ✓ {slug}")

posts.sort(key=lambda x: x.get('date', ''), reverse=True)

# --- 2. Spremi posts.json ---
out_json = os.path.join(blog_dir, 'posts.json')
with open(out_json, 'w', encoding='utf-8') as f:
    json.dump(posts, f, ensure_ascii=False, indent=2)
print(f"\n✅ posts.json – {len(posts)} postova")

posts_inline = json.dumps(posts, ensure_ascii=False)

# --- 3. Ugradi JSON u index.html ---
index_path = os.path.join(blog_dir, 'index.html')
c = open(index_path).read()
c = re.sub(
    r'const ARTICLES = \[.*?\];',
    f'const ARTICLES = {posts_inline};',
    c, flags=re.DOTALL
)
open(index_path, 'w').write(c)
print("✅ blog/index.html ažuriran")

# --- 4. Ugradi JSON u sidebar svih blog postova ---
for fpath in glob.glob(os.path.join(blog_dir, '*.html')):
    if 'index' in fpath:
        continue
    c = open(fpath).read()
    if 'weitere-artikel' not in c:
        continue
    c = re.sub(
        r'const posts = \[.*?\];',
        f'const posts = {posts_inline};',
        c, flags=re.DOTALL
    )
    open(fpath, 'w').write(c)
    print(f"✅ sidebar ažuriran – {os.path.basename(fpath)}")

print("\n🎉 Gotovo! Sada pushai na GitHub.")
