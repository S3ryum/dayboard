# DayBoard

A small local-first task board that runs in a browser. Tasks stay in that browser's local storage; there is no account or server-side data store.

## Features

- Add, complete, filter, and remove tasks.
- Keeps tasks after a page refresh in the same browser.
- Responsive layout and keyboard-friendly controls.

## Requirements

Node.js 20 or newer and npm.

## Build and run

~~~sh
npm install
npm run build
python -m http.server 8000
~~~

Open http://localhost:8000 in a browser. Keep the server command running while using the app.

## Privacy

Tasks are stored only in the browser's local storage. Clearing site data removes them. This is a personal-use demo, not a shared team board.
