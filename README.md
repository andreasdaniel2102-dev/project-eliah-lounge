# PROJECT ELIAH LOUNGE - Digitales Cockpit

Dies ist das interaktive digitale Cockpit für die Zimmer-Umgestaltung von Eliah (Projektleiter) und Papa (Investor & Sponsor).

Die Webseite fungiert als digitale Projektfreigabe, Investment-Präsentation und Fortschritts-Tracker.

## Features

- **Übersicht der Rollen & des Investitionspakets**
- **Interaktiver Fortschritts-Tracker (Checkliste)** für alle Umbauschritte
- **Budget-Rechner:** Dynamische Verteilung des 500 € Budgets mit Echtzeit-Validierung und Warnhinweisen bei Überziehung
- **Aufgabenverteiler:** Zuordnung der Aufgaben an Eliah, Papa oder Beide
- **Digitale Projektfreigabe:** Gemeinsamer Freigabeprozess mit Unterschriften und Konfetti-Effekt bei erfolgreicher Freigabe
- **Responsive Layout:** Optimiert für Smartphones (für die Nutzung direkt im Zimmer) und Desktops
- **LocalStorage-Persistenz:** Keine Registrierung oder Datenbank notwendig – alle Daten bleiben auf dem Gerät gespeichert

## Struktur

```text
project-eliah-lounge/
├── index.html          # HTML-Struktur der Webseite
├── style.css           # Premium Dark-Theme und Responsive-Layouts
├── app.js              # Interaktive Logik (Rechner, Unterschriften, LocalStorage)
├── assets/             # Medienordner für Bilder und Renders
│   ├── room/
│   ├── couch/
│   ├── renders/
│   └── icons/
├── docs/
│   └── project-spec.md # Fachliche Projektspezifikation
└── README.md           # Dieses Dokument
```

## Lokale Ausführung

Die Webseite ist eine statische Webanwendung. Zum Starten reicht ein Doppelklick auf die `index.html` im Browser.

Alternativ kann ein lokaler Webserver gestartet werden, um die Seite auszuführen:

**Mit Python:**
```bash
python -m http.server 8000
```
Danach im Browser `http://localhost:8000` öffnen.

**Mit Node.js (npx):**
```bash
npx serve .
```

## Deployment auf GitHub Pages

1. Erstelle ein neues GitHub-Repository (z.B. `project-eliah-lounge`).
2. Pushe diesen Code in das Repository.
3. Gehe in den Repository-Einstellungen auf **Pages**.
4. Wähle als Quelle den `main`-Branch und den Ordner `/` (Root) aus.
5. Speichere die Einstellungen. Die Seite ist unter `https://<dein-username>.github.io/project-eliah-lounge/` erreichbar.
