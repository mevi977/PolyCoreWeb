#!/usr/bin/env python3
"""
Pokreni: python3 blog/generate-posts.py
Regenerira posts.json iz meta tagova svih blog postova.
"""
import re, json, glob, os

posts = []
blog_dir = os.path.dirname(os.path.abspath(__file__))

for fpath in sorted(glob.glob(os.path.join(blog_dir, '*.html'))):
    if 'index' in fpath:
        continue
    c = open(fpath).read()

    def get_meta(name, prop='name'):
        m = re.search(rf'<meta {prop}="{name}" content="([^"]*)"', c)
        return m.group(1) if m else ''

    slug = '/blog/' + os.path.basename(fpath).replace('.html', '')
    title = get_meta('og:title', 'property')
    desc  = get_meta('og:description', 'property')
    img   = get_meta('og:image', 'property')
    cat   = get_meta('blog:category')
    rt    = get_meta('blog:readtime')
    date  = get_meta('blog:date')
    dateStr = get_meta('blog:datestr')

    if not title:
        print(f"  ⚠️  Preskačem {os.path.basename(fpath)} – nema og:title")
        continue

    posts.append({'slug': slug, 'title': title, 'desc': desc,
                  'img': img, 'cat': cat, 'rt': rt,
                  'date': date, 'dateStr': dateStr})
    print(f"  ✓ {slug}")

# Sortiraj po datumu – najnoviji prvi
posts.sort(key=lambda x: x.get('date',''), reverse=True)

out = os.path.join(blog_dir, 'posts.json')
with open(out, 'w', encoding='utf-8') as f:
    json.dump(posts, f, ensure_ascii=False, indent=2)

print(f"\n✅ posts.json ažuriran – {len(posts)} postova")
