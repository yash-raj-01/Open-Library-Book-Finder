const naam  = document.getElementById('naam');
const batao = document.getElementById('batao');
const jagah = document.getElementById('jagah');
const ruk   = document.getElementById('ruk');
const kuch  = document.getElementById('kuch');
const aise  = document.getElementById('aise');
const samay = document.getElementById('samay');
const kala  = document.getElementById('kala');
const lakshya = document.getElementById('lakshya');

const dLib = document.getElementById('dLib');
const dBrw = document.getElementById('dBrw');
const hk   = document.getElementById('hk');
const hkt  = document.getElementById('hkt');
const hv   = document.getElementById('hv');
const jLib = document.getElementById('jLib');
const lkB  = document.getElementById('lkB');
const wpj  = document.getElementById('wpj');

let data = [];
let mkh  = [];

dLib.onclick = (e) => {
    e.preventDefault();
    hk.style.display  = 'none';
    hv.style.display  = 'none';
    hkt.style.display = 'block';
    dLib.classList.add('active');
    dBrw.classList.remove('active');
    showLib();
};

dBrw.onclick = (e) => {
    e.preventDefault();
    hkt.style.display = 'none';
    hv.style.display  = 'none';
    hk.style.display  = 'block';
    dBrw.classList.add('active');
    dLib.classList.remove('active');
    if (data.length > 0) refresh();
};

wpj.onclick = () => {
    hv.style.display = 'none';
    if (dLib.classList.contains('active')) {
        hkt.style.display = 'block';
    } else {
        hk.style.display = 'block';
    }
};

async function showDet(key, title, author, cover, subject, year) {
    hk.style.display  = 'none';
    hkt.style.display = 'none';
    hv.style.display  = 'block';

    document.getElementById('vCh').src          = cover;
    document.getElementById('vTag').textContent  = subject.slice(0, 20);
    document.getElementById('vNm').textContent   = title;
    document.getElementById('vLk').textContent   = author;
    document.getElementById('vSl').textContent   = year;

    const isRead = mkh.some(b => b.key === key);
    const safeT  = title.replace(/'/g, "\\'");
    const safeA  = author.replace(/'/g, "\\'");

    const readBtn = isRead
        ? `<button class="padh-liya-btn" style="background-color:#112211;color:#F0F0F0;border:none;padding:12px 24px;border-radius:4px;font-weight:700;letter-spacing:1px;" disabled>I'VE READ THIS ✓</button>`
        : `<button class="padh-liya-btn" style="background-color:#112211;color:#F0F0F0;border:none;padding:12px 24px;border-radius:4px;font-weight:700;letter-spacing:1px;" onclick="parlia(event,'${key}','${safeT}','${safeA}','${cover}','${subject}','${year}')">I'VE READ THIS</button>`;

    document.getElementById('vBt').innerHTML = readBtn;

    const vKh = document.getElementById('vKh');
    vKh.textContent = 'Consulting the archives...';
    document.getElementById('vSt').innerHTML = '';
    document.getElementById('vRt').innerHTML = '';

    try {
        const res  = await fetch(`https://openlibrary.org${key}.json`);
        const json = await res.json();

        if (json.description) {
            vKh.textContent = typeof json.description === 'string' ? json.description : json.description.value;
        } else {
            vKh.textContent = 'No description available in the archives.';
        }

        let statsHTML = '';
        if (json.first_publish_date) {
            statsHTML += `<div>
                <div style="font-size:9px;font-weight:700;letter-spacing:1px;color:var(--text-muted);text-transform:uppercase;margin-bottom:5px;">Published Date</div>
                <div style="font-size:14px;font-weight:600;">${json.first_publish_date}</div>
            </div>`;
        }
        if (json.subjects && json.subjects.length > 0) {
            statsHTML += `<div>
                <div style="font-size:9px;font-weight:700;letter-spacing:1px;color:var(--text-muted);text-transform:uppercase;margin-bottom:5px;">Extracted Tags</div>
                <div style="font-size:14px;font-weight:600;">${json.subjects.slice(0, 3).join(', ')}</div>
            </div>`;
        }
        document.getElementById('vSt').innerHTML = statsHTML;

        try {
            const rRes  = await fetch(`https://openlibrary.org${key}/ratings.json`);
            const rJson = await rRes.json();

            if (rJson && rJson.summary && rJson.summary.average) {
                const r    = rJson.summary.average;
                const full = Math.floor(r);
                const dec  = r - full;

                const stars = Array.from({ length: 5 }, (_, i) => {
                    if (i < full) return '<span style="color:#FFC107;">★</span>';
                    if (i === full && dec > 0) {
                        const pct = Math.round(dec * 100);
                        return `<span style="position:relative;color:#d1d1d1;">★<span style="position:absolute;top:0;left:0;width:${pct}%;overflow:hidden;color:#FFC107;">★</span></span>`;
                    }
                    return '<span style="color:#d1d1d1;">★</span>';
                }).join('');

                const starHTML =
                    `<div style="font-size:10px;font-weight:700;letter-spacing:1px;color:var(--text-muted);text-transform:uppercase;margin-bottom:5px;">RATING</div>` +
                    `<div style="display:inline-flex;align-items:center;font-size:18px;line-height:1;letter-spacing:1px;">${stars}` +
                    `<span style="font-size:15px;font-weight:600;font-family:Inter,sans-serif;margin-left:10px;color:var(--text-main);">${r.toFixed(1)}</span></div>`;

                document.getElementById('vRt').innerHTML = `<div style="margin-bottom:30px;">${starHTML}</div>`;
            }
        } catch {
            console.log('Rating not found');
        }

    } catch (err) {
        console.error(err);
        vKh.textContent = 'Error consulting archives.';
    }
}

function showLib() {
    if (lakshya) lakshya.textContent = mkh.length;
    if (lkB)     lkB.textContent     = mkh.length;

    if (mkh.length === 0) {
        jLib.innerHTML = '<p class="fgh" style="grid-column:1/-1;text-align:center;margin-top:50px;">Your bookshelf is empty! Go back to Browse some books to log your first read.</p>';
        return;
    }

    let libraryData = [...mkh];
    const libSrt = document.getElementById('libSrt');

    if (libSrt) {
        const sortVal = libSrt.value;
        if (sortVal === 'titleAsc')  libraryData.sort((a, b) => a.title.localeCompare(b.title));
        if (sortVal === 'titleDesc') libraryData.sort((a, b) => b.title.localeCompare(a.title));
        if (sortVal === 'authorAsc') libraryData.sort((a, b) => (a.author || '').localeCompare(b.author || ''));
    }

    jLib.innerHTML = libraryData.map(book => {
        const safeTitle  = book.title.replace(/'/g, "\\'").replace(/"/g, '\\"');
        const authorStr  = book.author || 'Unknown';
        const safeAuthor = authorStr.replace(/'/g, "\\'").replace(/"/g, '\\"');
        const safeSubj   = book.subject.replace(/'/g, "\\'");

        return `
            <div class="kitaab" onclick="showDet('${book.key}','${safeTitle}','${safeAuthor}','${book.cover}','${safeSubj}','${book.year}')">
                <div class="cover-wrapper" style="box-shadow:0 8px 20px rgba(0,0,0,0.2);">
                    <img src="${book.cover}" alt="cover" class="chitra">
                </div>
                <div class="chota-text" style="background:#EFECE1;display:inline-block;padding:4px 10px;border-radius:12px;font-size:9px;align-self:flex-start;color:#1A3C34;margin-bottom:12px;">${book.subject.slice(0, 20)}</div>
                <h3 class="mota-text" style="font-size:22px;margin-bottom:8px;">${book.title}</h3>
                <p class="patla-text" style="font-size:14px;margin-bottom:20px;">${book.author}</p>
                <div style="display:flex;justify-content:space-between;align-items:center;margin-top:auto;">
                    <div class="badge">${book.year || 'N/A'}</div>
                    <button class="padh-liya-btn" onclick="event.stopPropagation()" style="background-color:#112211;color:#F0F0F0;border:none;padding:10px;border-radius:4px;font-weight:700;letter-spacing:1px;" disabled>MARK READ ✓</button>
                </div>
            </div>
        `;
    }).join('');
}

function parlia(event, key, title, author, cover, subject, year) {
    event.stopPropagation();
    event.preventDefault();

    if (mkh.some(b => b.key === key)) {
        alert('Pehle hi padh li hai! (Already read!)');
        return;
    }

    mkh.unshift({ key, title, author, cover, subject, year });

    if (lakshya) lakshya.textContent = mkh.length;
    if (lkB)     lkB.textContent     = mkh.length;

    event.target.textContent       = 'Read ✓';
    event.target.style.backgroundColor = '#EBF3EF';
    event.target.style.color           = '#2F694F';
    event.target.style.borderColor     = '#C4D7CF';
    event.target.disabled = true;
}

async function find() {
    const val = naam.value.trim();
    if (!val) return;

    ruk.classList.remove('hidden');
    jagah.innerHTML = '';

    try {
        const res  = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(val)}&limit=100`);
        const json = await res.json();

        if (!json.docs || json.docs.length === 0) {
            jagah.innerHTML = '<p class="fgh">No books found.</p>';
        } else {
            data = json.docs;
            refresh();
        }
    } catch (err) {
        console.error(err);
        jagah.innerHTML = '<p class="fgh">Error fetching data.</p>';
    }

    ruk.classList.add('hidden');
}

function refresh() {
    let result = [...data];

    const searchText = kuch.value.toLowerCase();
    if (searchText) {
        result = result.filter(book => {
            const t = book.title       ? book.title.toLowerCase()             : '';
            const a = book.author_name ? book.author_name[0].toLowerCase()    : '';
            return t.includes(searchText) || a.includes(searchText);
        });
    }

    const mode = samay.value;
    if (mode === 'recent')  result = result.filter(book => book.first_publish_year > 2000);
    if (mode === 'classic') result = result.filter(book => book.first_publish_year <= 2000);

    const sortBy = aise.value;
    if (sortBy === 'titleAsc')  result.sort((a, b) => a.title.localeCompare(b.title));
    if (sortBy === 'titleDesc') result.sort((a, b) => b.title.localeCompare(a.title));
    if (sortBy === 'newest')    result.sort((a, b) => (b.first_publish_year || 0)    - (a.first_publish_year || 0));
    if (sortBy === 'oldest')    result.sort((a, b) => (a.first_publish_year || 9999) - (b.first_publish_year || 9999));
    if (sortBy === 'famous')    result.sort((a, b) => (b.edition_count || 0)         - (a.edition_count || 0));

    show(result);
}

function show(books) {
    const kitne = document.getElementById('kitne');
    if (kitne) kitne.textContent = `${books.length} results found`;

    if (books.length === 0) {
        jagah.innerHTML = '<p class="fgh">No matches found.</p>';
        return;
    }

    jagah.innerHTML = books.map(book => {
        const bookCover  = book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg` : '';
        const cover      = bookCover || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80';
        const tag        = book.subject ? book.subject[0].toUpperCase() : 'LITERATURE';
        const bookKey    = book.key;
        const authorStr  = book.author_name ? book.author_name[0] : 'Unknown';
        const yearStr    = book.first_publish_year || 'N/A';

        const safeTitle  = book.title.replace(/'/g, "\\'").replace(/"/g, '\\"');
        const safeAuthor = authorStr.replace(/'/g, "\\'").replace(/"/g, '\\"');
        const safeSubj   = tag.replace(/'/g, "\\'");

        const isRead = mkh.some(b => b.key === bookKey);
        const btn = isRead
            ? `<button class="padh-liya-btn" onclick="event.stopPropagation()" style="background-color:#EBF3EF;color:#2F694F;border-color:#C4D7CF" disabled>Read ✓</button>`
            : `<button class="padh-liya-btn" onclick="parlia(event,'${bookKey}','${safeTitle}','${safeAuthor}','${cover}','${safeSubj}','${yearStr}')">I've read this</button>`;

        return `
            <div class="kitaab" onclick="showDet('${bookKey}','${safeTitle}','${safeAuthor}','${cover}','${safeSubj}','${yearStr}')">
                <div class="cover-wrapper">
                    <img src="${cover}" alt="cover" class="chitra">
                </div>
                <div class="chota-text">${tag.slice(0, 25)}</div>
                <h3 class="mota-text">${book.title}</h3>
                <p class="patla-text">${authorStr}</p>
                <div style="display:flex;justify-content:space-between;align-items:center;margin-top:auto;">
                    <div class="badge">${yearStr}</div>
                    ${btn}
                </div>
            </div>
        `;
    }).join('');
}

kala.onclick = () => {
    document.body.classList.toggle('dark-mode');
    kala.textContent = document.body.classList.contains('dark-mode') ? 'Light' : 'Dark';
};

batao.onclick = find;
naam.onkeydown = (e) => { if (e.key === 'Enter') find(); };

kuch.oninput   = refresh;
aise.onchange  = refresh;
samay.onchange = refresh;

const libSrt = document.getElementById('libSrt');
if (libSrt) libSrt.onchange = showLib;
