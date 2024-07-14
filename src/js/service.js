
export async function downloadBooks(Title, Category, Page) {
    let url = `https://openlibrary.org/search.json?limit=10&page=${Page}`;
    if (Title) {
        url += `&title=${encodeURIComponent(Title)}`;
    }
    if (Category && Category !== "All") {
        url += `&subject=${encodeURIComponent(Category)}`;
    }
    
    let response = await fetch(url);
    
    if (!response.ok) {
        throw new Error('Errore nel caricamento dei libri');
    }

    let books = await response.json();
    return books;
}

export async function fetchBookDescription(key) {
    let url = `https://openlibrary.org${key}.json`;
    let response = await fetch(url);
    
    if (!response.ok) {
        throw new Error('Errore nel caricamento dei dati');
    }

    let bookData = await response.json();
    return bookData;
}
