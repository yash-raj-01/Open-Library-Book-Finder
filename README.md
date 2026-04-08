# 📚 Open Library Book Finder

## 📖 Project Overview
The Open Library Book Finder is a vanilla JavaScript web application that allows users to search for books using a public API. Users can explore book details, view cover images, track their reading progress, and manage a personal bookshelf — all within a single-page interface.

This project is built to practice working with APIs, handling UI states, and creating interactive frontend applications.

---

## 🎯 Purpose
- Practice API integration with real-world data  
- Improve JavaScript skills (async/await, array HOFs, DOM manipulation)  
- Build an interactive and responsive UI  
- Handle edge cases like empty results and loading states  

---

## 🌐 Public API
This project uses the Open Library API:
- Public API: https://openlibrary.org/developers/api

---

## ✨ Features
- 🔍 Search books by title or author  
- 🖼️ Display book covers in a grid layout  
- 📅 Sort books by: Relevance, Title A–Z, Title Z–A, Newest, Oldest, Most Editions  
- 🗂️ Filter results by keyword and Publication Era (Recent / Classic)  
- 📖 Full Book Detail view with description, published date, subject tags & star rating  
- ⭐ Live star rating fetched from Open Library ratings API  
- 📚 My Library — personal bookshelf to track books you've read  
- 🎯 Annual Reading Goal Tracker (Goal: X / 50)  
- ✅ "I've Read This" button — marks a book as read and adds it to your library  
- 🌙 Dark / Light mode toggle  
- 🧭 SPA-style navigation (Browse, My Library, Book Detail — no page reloads)  
- ⚠️ Handles empty search results and API errors gracefully  

---

## 🛠️ Technologies Used
- HTML  
- JavaScript
- CSS
- Fetch API


---

## 📁 Project Structure

```
Open-Library-Book-Finder/
├── index.html     → App structure, 3 SPA sections (Browse, My Library, Detail)
├── style.css      → All styles, CSS variables, dark mode, responsive layout
├── script.js      → All logic: search, filter, sort, navigation, API calls
└── README.md      → Project documentation
```

---


## ⚠️ Known Limitations

- 📦 **No persistent storage** — library resets on page refresh (no localStorage)  
- 🌐 **API rate limits** — Open Library is a free public API with no auth; may slow under heavy requests  
- 📷 **Missing covers** — some books don't have cover images; a fallback photo is shown  
- 📝 **Missing descriptions** — not all books have descriptions in the Open Library database  
- ⭐ **Missing ratings** — many books have no ratings data; the rating section is hidden if unavailable  
- 🎯 **Fixed goal** — the annual reading goal is hardcoded at 50  

---
