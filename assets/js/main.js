var currentPage = 1;

document.addEventListener('DOMContentLoaded', function () {
    let searchForm = document.getElementById('searchForm');
    searchForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        currentPage = 1;
        await loadBooks();
    });

    document.getElementById('prevPage').addEventListener('click', async function () {
        if (currentPage > 1) {
            currentPage--;
            await loadBooks();
        }
    });

    document.getElementById('nextPage').addEventListener('click', async function () {
        currentPage++;
        await loadBooks();
    });
});

async function loadBooks() {
    ClearBooksList();

    let searchText = document.getElementById('searchInput').value;
    let selectedCategory = document.getElementById('categorySelect').value;
    let booksFound = await downloadBooks(searchText, selectedCategory, currentPage);
    booksFound.docs.forEach(function (book) {
        AddBookToList(book);
    });

    updatePaginationButtons(booksFound.numFound);
}

async function downloadBooks(Title, Category, Page) {
    let url = "https://openlibrary.org/search.json?title=" + encodeURIComponent(Title) + "&limit=10&page=" + Page;
    if (Category && Category !== "All") {
        url += "&subject=" + encodeURIComponent(Category);
    }
    let response = await fetch(url);
    let books = await response.json();
    return books;
}

function AddBookToList(book) {
    let booksContainer = document.getElementById('booksContainer');

    let bookElement = document.createElement('div');
    bookElement.classList.add('book-item');

    let bookTitle = document.createElement('p');
    bookTitle.textContent = book.title;
    bookTitle.classList.add('book-title');
    bookElement.appendChild(bookTitle);

    let bookAuthor = document.createElement('p');
    bookAuthor.textContent = 'di ' + (book.author_name ? book.author_name.join(', ') : 'Autore sconosciuto');
    bookAuthor.classList.add('book-author');
    bookElement.appendChild(bookAuthor);

    let descriptionButton = document.createElement('button');
    descriptionButton.textContent = 'vedi descrizione';
    descriptionButton.classList.add('btn', 'btn-primary', 'mt-2');
    descriptionButton.setAttribute('data-bs-toggle', 'modal');
    descriptionButton.setAttribute('data-bs-target', '#bookDescriptionModal');
    descriptionButton.addEventListener('click', function () {
        showBookDescription(book.key);
    });
    bookElement.appendChild(descriptionButton);

    booksContainer.appendChild(bookElement);
}

async function showBookDescription(key) {
    document.getElementById('bookDescriptionModalLabel').textContent = 'Nessun titolo trovato';
    document.getElementById('bookDescriptionContent').textContent = 'Nessuna descrizione trovata';

    let url = `https://openlibrary.org${key}.json`;
    let response = await fetch(url);
    let bookData = await response.json();

    if (bookData) {
        document.getElementById('bookDescriptionModalLabel').textContent = bookData.title || 'Nessun titolo trovato';
        document.getElementById('bookDescriptionContent').textContent = bookData.description ? (typeof bookData.description === 'string' ? bookData.description : bookData.description.value) : 'Nessuna descrizione trovata';
    }
}

function ClearBooksList() {
    let booksContainer = document.getElementById('booksContainer');
    booksContainer.innerHTML = '';

    let prevPage = document.getElementById("prevPage");
    prevPage.classList.add("hidden");

    let nextPage = document.getElementById("nextPage");
    nextPage.classList.add("hidden");
}

function updatePaginationButtons(numFound) {
    if (currentPage > 1) {
        document.getElementById('prevPage').classList.remove('hidden');
    } else {
        document.getElementById('prevPage').classList.add('hidden');
    }

    if ((currentPage * 10) < numFound) {
        document.getElementById('nextPage').classList.remove('hidden');
    } else {
        document.getElementById('nextPage').classList.add('hidden');
    }
}
