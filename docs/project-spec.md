# Projekt-Spezifikation: PROJECT ELIAH LOUNGE

Dieses Dokument spezifiziert die Rahmenbedingungen, Rollen, Inhalte und Budgets für die Zimmer-Umgestaltung.

## 1. Rollen & Verantwortlichkeiten

### Projektleiter: Eliah
* **Verantwortung:**
  * Gesamtkoordination der Design-Entscheidungen (Farben, Anordnung).
  * Auswahl der zusätzlichen Einrichtungsgegenstände im Rahmen des Budgets.
  * Führung bei der Aufgabenverteilung.
  * Pflege des Projektfortschritts.

### Investor, Sponsor & Unterstützer: Papa (Andi)
* **Verantwortung:**
  * Bereitstellung des Investitionspakets.
  * Fachliche Beratung bei Renovierungsarbeiten (insb. Parkettbearbeitung und Elektro/Licht).
  * Aktive Unterstützung beim Aufbau.

---

## 2. Das Investitionspaket des Sponsors

Der Sponsor stellt folgendes Paket exklusiv für das Projekt bereit:
1. **Couch:** Die vorhandene Couch aus dem Wohnzimmer wird vollständig in das Eigentum des Lounge-Projekts überführt.
2. **Projektzuschuss:** Ein Budget von **500,00 €** steht als finanzielle Basis zur freien Verfügung für das Projekt (z.B. für Wandfarbe, Schleifmaschinenmiete, Parkettöl, Deko). Dies stellt nicht das Gesamtbudget dar, sondern den Sponsor-Zuschuss.
3. **Persönliche Arbeitszeit:** Der Sponsor garantiert **4 Stunden** aktive, persönliche Mitarbeit bei schweren Renovierungsarbeiten (z.B. Parkett abschleifen).
4. **Planungs- & Aufbauhilfe:** Fachliche Begleitung und Beratung über die gesamte Projektlaufzeit.
5. **Raumbasis:** Bereitstellung des Raumes als exklusive Projektfläche.

---

## 3. Projektumfang (Scope)

Das Projekt umfasst folgende Arbeitsschritte, die im interaktiven Tracker gesteuert werden:

* **Zimmer ausräumen:** Vollständiges Entleeren des Raumes vor Beginn der Arbeiten.
* **Parkettboden abschleifen:** Abschleifen der alten Lack-/Ölschicht (Gemeinschaftsarbeit).
* **Boden ölen:** Schutzbehandlung des geschliffenen Bodens mit geeignetem Holzöl.
* **Wände streichen:** Farbliches Highlight setzen (z.B. eine Akzentwand in dunklem Anthrazit oder Navy).
* **Couch integrieren:** Transport, Platzierung und Reinigung der Wohnzimmer-Couch im Raum.
* **TV-/Lounge-Bereich:** Planung der optimalen Positionierung von Bildschirm und Sitzgelegenheit.
* **Lichtkonzept:** Installation einer steuerbaren, indirekten LED-Beleuchtung (z.B. hinter der Couch oder an Fußleisten).
* **Gemeinsamer Aufbau:** Endmontage aller Komponenten und Inbetriebnahme der Lounge.

### Optionale Add-ons (nach Budgetlage)
* **Gaming-Touch:** Dezente Beleuchtungsakzente oder Halterungen für Controller.
* **Getränkekühlschrank:** Kleiner, leiser Kühlschrank für Softdrinks.

---

## 4. Technische Implementierung der Web-App

Die Web-App dient als interaktives Cockpit für das Projekt.

* **Technologie:** Rein statisches HTML5, CSS3 (CSS Variables, Flexbox, CSS Grid) und Vanilla JS (ES6).
* **Zustandsspeicherung:** Alle Eingaben (Erledigte Aufgaben, Budgetzuteilung, Signaturen) werden lokal im Browser via `localStorage` gespeichert.
* **Responsivität:** Vollständige Optimierung für Smartphones (iOS/Android) und Desktop-Browser.
* **Interaktive Signaturen:** Die finale Freigabe erfordert das "digitale Unterschreiben" (Bestätigen) von Eliah und Papa. Bei Aktivierung beider Schalter wird ein feierlicher Konfetti-Regen (HTML5 Canvas) ausgelöst und das Projekt in den Status "Aktiv" versetzt.
