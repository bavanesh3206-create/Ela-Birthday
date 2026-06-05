# Happy Birthday Annaa — Elavarasan (Appu)

A premium glassmorphism birthday website for **09 June 2026**.

## Quick start

Open `index.html` in a browser, or run a local server:

```bash
npx serve .
```

## Personalize

### Family photos

In `styles.css`, replace the Unsplash URLs in `.slide-childhood`, `.slide-school`, `.slide-family`, and `.slide-recent` with your own images:

```css
.slide-childhood {
  background-image: url('photos/childhood.jpg');
}
```

Add photos to a `photos/` folder next to `index.html`.

### Background music

Place an MP3 file at:

```
assets/birthday-music.mp3
```

Use the **Music** button in the nav to play or pause.

### Family & friend messages

On the website, each person types their name, relation, message type (wish, advice, memory, etc.), and message. Saved in the browser for Appu to read.

### Memory photos

Edit `MEMORY_PHOTOS` in `script.js` — photos shuffle across the full site every 12 seconds.

### Entry flow (for Appu)

1. Tap to begin → 10 second wait
2. **5 quick questions** — each answer must be **at least 10 characters**
3. **Let's Celebrate** — website blasts open (confetti, fireworks, flash)
4. Answers appear at the bottom in **Your Quick Answers**

Edit `GATE_QUESTIONS` in `script.js` to change questions.

## Features

- Glassmorphism UI with particles and glowing orbs
- Photo slider, memory timeline, categorized wishes
- Motivation quotes, universe message, handwritten letter
- Future vision cards, fireworks, confetti, balloons
- Birthday countdown to 09 June 2026
- Mobile-responsive navigation

Made with love by Bavanesh.