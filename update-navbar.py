#!/usr/bin/env python3
"""
POLYCORE - Navbar Update Skripta
Pokreni: python3 update-navbar.py
Automatski azurira navbar u svim HTML fajlovima.
"""
import glob, re, sys
from pathlib import Path

ROOT = Path(__file__).parent

def get_nav(fpath, is_root=True):
    """Citaj navbar iz fajla i prilagodi putanje."""
    c = open(fpath, encoding='utf-8').read()
    nav_start = c.find('<nav class="nav">')
    nav_end = c.find('\n<!-- PAGE HERO -->')
    if nav_end == -1:
        nav_end = c.find('\n<section')
    if nav_start == -1:
        return None
    return c[nav_start:nav_end]

def update_file(fpath, nav_root, nav_sub):
    """Azuriraj navbar u jednom HTML fajlu."""
    c = open(fpath, encoding='utf-8', errors='ignore').read()
    
    # Nadjimo stari navbar
    nav_start = c.find('<nav class="nav">')
    if nav_start == -1:
        return False
    
    # Nadjimo kraj navbara
    nav_end = c.find('\n<!-- PAGE HERO -->')
    if nav_end == -1:
        nav_end = c.find('\n<section class="page-hero"')
    if nav_end == -1:
        nav_end = c.find('\n<section class="hero"')
    if nav_end == -1:
        nav_end = c.find('\n<main')
    if nav_end == -1:
        return False
    
    # Odaberi ispravnu verziju navbara
    rel_path = Path(fpath).relative_to(ROOT)
    parts = rel_path.parts
    
    if len(parts) == 1:
        # Root nivo (index.html, kontakt.html, itd.)
        new_nav = nav_root
    else:
        # Podstranica (leistungen/, blog/, regionen/)
        new_nav = nav_sub
    
    old_nav = c[nav_start:nav_end]
    if old_nav == new_nav:
        return False
    
    new_c = c[:nav_start] + new_nav + c[nav_end:]
    open(fpath, 'w', encoding='utf-8').write(new_c)
    return True

if __name__ == '__main__':
    # Source navbar - uzmi iz epoxidharz-boden.html (podstranica)
    source = ROOT / 'leistungen' / 'epoxidharz-boden.html'
    if not source.exists():
        print("ERROR: leistungen/epoxidharz-boden.html ne postoji!")
        sys.exit(1)
    
    nav_sub = get_nav(source)
    if not nav_sub:
        print("ERROR: Navbar nije pronađen u source fajlu!")
        sys.exit(1)
    
    # Pripremi root verziju (zamijeni ../  s /)
    nav_root = nav_sub
    nav_root = nav_root.replace('src="../assets/', 'src="assets/')
    nav_root = nav_root.replace('href="../leistungen/', 'href="leistungen/')
    nav_root = nav_root.replace('href="../blog', 'href="blog')
    nav_root = nav_root.replace('href="../projekte', 'href="projekte')
    nav_root = nav_root.replace('href="../ueber-uns', 'href="ueber-uns')
    nav_root = nav_root.replace('href="../kontakt', 'href="kontakt')
    nav_root = nav_root.replace('href="../farbpalette', 'href="farbpalette')
    nav_root = nav_root.replace('href="../regionen', 'href="regionen')
    nav_root = nav_root.replace('href="../agb', 'href="agb')
    nav_root = nav_root.replace('href="../datenschutz', 'href="datenschutz')
    nav_root = nav_root.replace('href="../impressum', 'href="impressum')
    nav_root = nav_root.replace('href="../index.html"', 'href="/"')
    nav_root = nav_root.replace('../assets/img/PolyCoreLogo', 'assets/img/PolyCoreLogo')
    nav_root = nav_root.replace('../assets/img/1PolyCoreLogo', 'assets/img/1PolyCoreLogo')
    
    print(f"Source: {source}")
    print(f"Navbar velicina: {len(nav_sub)} chars")
    print()
    
    count = 0
    skip = 0
    
    for fpath in sorted(glob.glob(str(ROOT / '**/*.html'), recursive=True)):
        if any(x in fpath for x in ['.git', 'admin', 'bericht', 'projekt-admin']):
            continue
        
        result = update_file(fpath, nav_root, nav_sub)
        rel = str(Path(fpath).relative_to(ROOT))
        
        if result:
            print(f"✓ {rel}")
            count += 1
        else:
            skip += 1
    
    print(f"\n✅ Azurirano: {count} fajlova")
    print(f"⏭  Preskoceno: {skip} fajlova (vec aktualni ili nema navbar)")
    print(f"\nDa pushases na GitHub:")
    print(f"  git add -A && git commit -m 'nav: globalni navbar azuriran' && git push")
