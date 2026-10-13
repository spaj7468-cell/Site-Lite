# Site-Lite Architecture

## Core flow

User Editor
→ Project Data
→ Site-Lite Runtime
→ Export Pipeline
→ HTML + CSS + JavaScript

## Project format

A project stores:

- pages
- components
- parameters
- assets
- animations
- settings

## Components

Components are reusable website objects:

- Hero
- Button
- Card
- Gallery
- Navigation

## Animation system

Supports:

- timeline
- keyframes
- position
- scale
- rotation
- opacity
- easing

## Export

The exported website contains:

```
index.html
style.css
script.js
assets/
```

The exported result should work independently without Site-Lite services.
