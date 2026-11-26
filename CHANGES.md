# CURIOSITY UI upgrade: changed files
Paste these over the same paths in the repo (keep the folder structure), commit, push.

- css/styles.css: full design-system rewrite (tokens, dark/light themes, components, responsive)
- js/app.js: grouped sidebar, theme toggle with icon, fixed right rail (stray "null" text and broken Daily card), greeting
- js/feed.js: desktop previous/next buttons, device-aware hint text
- js/views.js: progress bar on subject tiles
- js/views2.js: "Skip for now" in onboarding
- index.html, manifest.webmanifest: colour tokens
- sw.js: cache VERSION bumped to curiosity-v2.1.0 so installed PWAs pick up the new CSS
