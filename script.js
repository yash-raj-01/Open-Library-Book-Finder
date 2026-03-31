const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const resultsDiv = document.getElementById('results');
const loadingDiv = document.getElementById('loading');

function doSearch() {
    const query = searchInput.value.trim();
    if (!query) {
        return;
    }

    loadingDiv.classList.remove('hidden');
    resultsDiv.innerHTML = '';

    fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&mode=everything`)
        .then(res => res.json())
        .then(data => {
            if (!data.docs || data.docs.length === 0) {
                resultsDiv.innerHTML = '<p class="status-msg">No books directly matched your search.</p>';
            } else {
                render(data.docs);
            }
            loadingDiv.classList.add('hidden');
        })
        .catch(err => {
            console.error(err);
            resultsDiv.innerHTML = '<p class="status-msg">No books directly matched your search.</p>';
            loadingDiv.classList.add('hidden');
        });
}

searchBtn.onclick = doSearch;

searchInput.onkeydown = (e) => {
    if (e.key === 'Enter') {
        doSearch();
    }
};

function render(books) {
    resultsDiv.innerHTML = books.map(book => {
        const cover = book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : 'https://via.placeholder.com/150x200?text=No+Cover';
        return `
            <div class="book-card">
                <img src="${cover}" alt="cover">
                <h3>${book.title}</h3>
                <p>By ${book.author_name ? book.author_name[0] : 'Unknown'}</p>
                <p>Published: ${book.first_publish_year || 'N/A'}</p>
            </div>
        `;
    }).join('');
}
