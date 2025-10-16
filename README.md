# Music-App

A responsive web application that allows users to search for music artists and explore detailed information including their bio, top albums, and similar artists. The app integrates with the Last.fm API to fetch real-time data.

---

## Features

- Search for artists by name.
- View artist details: biography, listener count, and tags.
- Display top albums with cover images and play counts.
- Explore similar artists and navigate between them.
- Responsive design for mobile, tablet, and desktop screens.
- Clean and modular architecture using plain HTML, CSS, and JavaScript.

---

## Project Structure

music-app/
│
├── index.html # Main HTML page
├── main.css # Application styles
├── dev.js # JavaScript logic and API integration
└── public/
└── no-img.png # Default fallback image

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Edge, Safari)
- Internet connection (for API calls)

## How It Works

1. Artist Search

Users type an artist name into the search bar and press Enter.
The app queries the Last.fm API and displays matching artists with their listener counts.

2. Artist Details Page

Clicking an artist shows:
Name, listener count, and bio
Tags associated with the artist
Top albums (displayed as cards with image and play count)
A list of similar artists (clickable)

3. Fallbacks and Feedback

If no results are found, a "No artists found" message is displayed.
If an album has no image, a default image is shown.

## Technologies Used

HTML5 – Markup structure
CSS3 – Styling and responsive layout
JavaScript (ES6+) – API interaction and DOM manipulation
Last.fm API
 – Artist and album data

## Future Improvements

Add pagination for large result sets
Implement better error handling for network issues
Add a loading indicator while data is being fetched
Improve artist page design (e.g., audio previews, related links)
Deploy to a live URL (e.g., GitHub Pages, Netlify)