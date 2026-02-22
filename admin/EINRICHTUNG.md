# POLYCORE Admin Panel – Einrichtung

## Was ist das?
Decap CMS (früher Netlify CMS) – ein kostenloses, professionelles
Content-Management-System das direkt im Browser läuft.

**Login:** GitHub (du bist Repo-Inhaber = automatisch Admin)
**Zugriff:** https://poly-core-web.vercel.app/admin/
**Sprache:** Deutsch

---

## Einmalige Einrichtung (5–10 Minuten)

### Schritt 1: Netlify für OAuth registrieren (kostenlos)

1. Gehe zu https://app.netlify.com
2. Erstelle ein kostenloses Konto (mit GitHub einloggen)
3. Klicke: **"Add new site" → "Import an existing project"**
4. Wähle dein GitHub-Repo: **mevi977/PolyCoreWeb**
5. Netlify braucht NICHT zu deployen – wir nutzen nur den OAuth-Service
6. Sobald die Site in Netlify angelegt ist, gehe zu:
   **Site Settings → Identity → Enable Identity**
7. Dann: **Identity → Registration → Invite only**
8. Dann: **Identity → External providers → GitHub → Enable**
9. Gehe zu: **Settings → Access control → OAuth**
10. Klicke: **"Install provider" → GitHub**
11. Notiere die **Client ID** und **Client Secret** die Netlify dir gibt

### Schritt 2: GitHub OAuth App erstellen

1. Gehe zu: https://github.com/settings/developers
2. Klicke: **"New OAuth App"**
3. Fülle aus:
   - **Application name:** POLYCORE CMS
   - **Homepage URL:** https://poly-core-web.vercel.app
   - **Authorization callback URL:** https://api.netlify.com/auth/done
4. Speichern → Client ID und Secret in Netlify (Schritt 1, Punkt 11) eintragen

### Schritt 3: Admin-URL aufrufen

1. Öffne: **https://poly-core-web.vercel.app/admin/**
2. Klicke: **"Login with GitHub"**
3. Fertig – du bist drin!

---

## Was kannst du im Admin bearbeiten?

| Bereich | Was du bearbeiten kannst |
|---------|--------------------------|
| 🔧 Leistungen | Texte, Beschreibungen, Hero-Bilder, Meta-Texte |
| 📝 Blog | Neue Artikel erstellen, bestehende bearbeiten, Bilder hochladen |
| 🏗 Projekte | Referenzprojekte hinzufügen mit Bild, Kategorie, Ort |
| ⚙️ Einstellungen | Telefon, E-Mail, Adresse, Social Media Links |

---

## Bilder hochladen

- Im Admin-Panel: Klicke bei einem Bild-Feld auf **"Choose an image"**
- Wähle: **"Upload" → Datei auswählen**
- Das Bild wird automatisch in `/assets/img/uploads/` gespeichert
- **Empfohlene Formate:** JPG, WebP
- **Maximale Grösse:** 2 MB pro Bild
- **Empfohlene Breite:** 1920px (Hero), 800px (Blog), 600px (Projekte)

---

## Workflow: Änderung vornehmen

1. `/admin/` aufrufen → einloggen
2. Gewünschten Bereich wählen (z.B. Blog → Artikel)
3. Inhalt bearbeiten → **"Speichern"** klicken
4. Optional: **"Publish"** klicken für sofortige Veröffentlichung
5. GitHub wird automatisch aktualisiert
6. Vercel deployt die Änderung innerhalb von ~60 Sekunden

---

## Fehlerbehebung

**Login funktioniert nicht?**
→ Prüfe ob OAuth App korrekt konfiguriert ist (Schritt 2)
→ Prüfe ob Netlify Identity aktiviert ist (Schritt 1)

**Bilder werden nicht angezeigt?**
→ Prüfe ob der Ordner `/assets/img/uploads/` im Repo existiert

**Änderungen erscheinen nicht auf der Website?**
→ Vercel braucht ~60 Sekunden zum Deployen
→ Prüfe Vercel Dashboard auf Fehler: https://vercel.com/dashboard
