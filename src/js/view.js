
import { downloadBooks } from './service.js';
import { fetchBookDescription } from './service.js';

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

function showSpinner() {
    document.getElementById('spinnerImage').classList.remove('hiddenspinner');
}

function hideSpinner() {
    document.getElementById('spinnerImage').classList.add('hiddenspinner');
}

function showError(message) {
    const errorContainer = document.getElementById('errorContainer');
    errorContainer.textContent = message;
    errorContainer.classList.remove('hidden');
}

function hideError() {
    const errorContainer = document.getElementById('errorContainer');
    errorContainer.classList.add('hidden');
}

async function loadBooks() {
    ClearBooksList();
    showSpinner();
    hideError();

    let searchText = document.getElementById('searchInput').value.trim();
    let selectedCategory = document.getElementById('categorySelect').value;

    try {
        let booksFound = await downloadBooks(searchText, selectedCategory, currentPage);
        _.get(booksFound, 'docs', []).forEach(function (book) {
            AddBookToList(book);
        });

        updatePaginationButtons(_.get(booksFound, 'numFound', 0));
    } catch (error) {
        console.error('Errore durante il caricamento dei libri:', error);
        showError('Si è verificato un errore durante il caricamento dei libri. Riprova più tardi.');
    } finally {
        hideSpinner();
    }
}

function AddBookToList(book) {
    let booksContainer = document.getElementById('booksContainer');

    let bookElement = document.createElement('div');
    bookElement.classList.add('book-item');

    let bookTitle = document.createElement('p');
    bookTitle.textContent = _.get(book, 'title', 'Titolo non disponibile');
    bookTitle.classList.add('book-title');
    bookElement.appendChild(bookTitle);

    let bookAuthor = document.createElement('p');
    bookAuthor.textContent = 'di ' + (_.get(book, 'author_name', ['Autore sconosciuto']).join(', '));
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
    console.log(key);
    const modalLabel = document.getElementById('bookDescriptionModalLabel');
    const modalContent = document.getElementById('bookDescriptionContent');
    
    modalLabel.textContent = 'Caricamento...';
    modalContent.textContent = 'Attendi il caricamento';

    try {
        let bookData = await fetchBookDescription(key);

        modalLabel.textContent = _.get(bookData, 'title', 'Nessun titolo trovato');
        modalContent.textContent = _.get(bookData, 'description', 'Nessuna descrizione trovata');
        if (typeof modalContent.textContent !== 'string') {
            modalContent.textContent = _.get(modalContent.textContent, 'value', 'Nessuna descrizione trovata');
        }
    } catch (error) {
        console.error('Errore durante il caricamento del titolo o della descrizione:', error);
        modalLabel.textContent = 'Errore';
        modalContent.textContent = 'Si è verificato un errore durante il caricamento del titolo o della descrizione. Riprova più tardi.';
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
