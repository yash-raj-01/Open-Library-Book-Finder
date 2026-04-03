const searchBox = document.getElementById('searchBox');
const findBtn = document.getElementById('findBtn');
const bookList = document.getElementById('bookList');
const loader = document.getElementById('loader');
const filterBox = document.getElementById('filterBox');
const sortDropdown = document.getElementById('sortDropdown');
const filterDropdown = document.getElementById('filterDropdown');
const themeBtn = document.getElementById('themeBtn');

let data = [];

function find() {
    const val = searchBox.value.trim();
    if (!val) return;

    loader.classList.remove('hidden');
    bookList.innerHTML = '';

    fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(val)}&limit=100`)
        .then(res => res.json())
        .then(json => {
            if (!json.docs || json.docs.length === 0) {
                bookList.innerHTML = '<p class="info-text">No books found.</p>';
            } else {
                data = json.docs;
                refresh();
            }
            loader.classList.add('hidden');
        })
        .catch(err => {
            console.error(err);
            bookList.innerHTML = '<p class="info-text">Error fetching data.</p>';
            loader.classList.add('hidden');
        });
}

function refresh() {
    let result = [...data];

    const searchText = filterBox.value.toLowerCase();
    if (searchText) {
        result = result.filter(book => {
            const title = book.title ? book.title.toLowerCase() : "";
            const author = book.author_name ? book.author_name[0].toLowerCase() : "";
            return title.includes(searchText) || author.includes(searchText);
        });
    }

    const mode = filterDropdown.value;
    if (mode === 'recent') {
        result = result.filter(book => book.first_publish_year > 2000);
    } else if (mode === 'classic') {
        result = result.filter(book => book.first_publish_year <= 2000);
    }

    const sortBy = sortDropdown.value;
    if (sortBy === 'titleAsc') {
        result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'titleDesc') {
        result.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortBy === 'newest') {
        result.sort((a, b) => (b.first_publish_year || 0) - (a.first_publish_year || 0));
    } else if (sortBy === 'oldest') {
        result.sort((a, b) => (a.first_publish_year || 9999) - (b.first_publish_year || 9999));
    } else if (sortBy === 'famous') {
        result.sort((a, b) => (b.edition_count || 0) - (a.edition_count || 0));
    }

    show(result);
}

function show(books) {
    if (books.length === 0) {
        bookList.innerHTML = '<p class="info-text">No matches found.</p>';
        return;
    }

    bookList.innerHTML = books.map(book => {
        const cover = book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : 'https://via.placeholder.com/150x200?text=No+Cover';
        
        return `
            <div class="card">
                <img src="${cover}" alt="cover">
                <h3>${book.title}</h3>
                <p>By ${book.author_name ? book.author_name[0] : 'Unknown'}</p>
                <p>Published: ${book.first_publish_year || 'N/A'}</p>
            </div>
        `;
    }).join('');
}

themeBtn.onclick = () => {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        themeBtn.textContent = 'Light';
    } else {
        themeBtn.textContent = 'Dark';
    }
};

findBtn.onclick = find;
searchBox.onkeydown = (e) => { if (e.key === 'Enter') find(); };

filterBox.oninput = refresh;
sortDropdown.onchange = refresh;
filterDropdown.onchange = refresh;
