
/* ARRAY BUKU */
const books = [];
/* PATOKAN DASAR PERUBAHAN DATA VARIABEL BOOK */
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';
/* FUNGSI TAMBAH BUKU */
function addBook() {
    const title = document.getElementById('inputBookTitle').value;
    const author = document.getElementById('inputBookAuthor').value;
    const year = parseInt(document.getElementById('inputBookYear').value);
    const isComplete = document.getElementById('inputBookIsComplete').checked;
    /* KONSOL CEKLIST isComplete */
    console.log(isComplete)
    const generatedID = generateID();
    const bookObject = generateBookObject(generatedID, title, author, year, isComplete);

    books.push(bookObject);
    /* RENDER DATA YANG TELAH DISIMPAN KE ARRAY BOOK */
    document.dispatchEvent(new Event(RENDER_EVENT));
    /* implementasi localStorage */
    saveData();
}
/* MENGHASILKAN ID UNIK */
function generateID() {
    return +new Date();
}
/* OBYEK BUKU DARI DATA INPUTAN */
function generateBookObject(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year,
        isComplete,
    }
}

function makeBook(bookObject) {
    const textTitle = document.createElement('h3');
    textTitle.innerText = bookObject.title;

    const textYear = document.createElement('p');
    textYear.innerText = bookObject.year;

    const textAuthor = document.createElement('h4');
    textAuthor.innerText = bookObject.author;

    const textContainer = document.createElement('div');
    textContainer.classList.add('daleman-item');
    textContainer.append(textTitle, textAuthor, textYear);

    const container = document.createElement('div');
    container.classList.add('tempat-item')
    container.classList.add('card')
    container.append(textContainer);
    container.setAttribute('id', `book-${bookObject.id}`);

    if (bookObject.isComplete) {
        const undoButton = document.createElement('button');
        undoButton.classList.add('undo-button');
        undoButton.innerText = 'Belum selesai'

        undoButton.addEventListener('click', function () {
            undoBookFromCompleted(bookObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');
        trashButton.innerText = 'Hapus buku'

        trashButton.addEventListener('click', function () {
            removeBookFromCompleted(bookObject.id);
            alert('Buku sudah dihapus dari rak');
        });

        container.append(undoButton, trashButton);
    } else {
        const completeButton = document.createElement('button');
        completeButton.classList.add('complete-button');
        completeButton.innerText = 'Selesai dibaca';

        completeButton.addEventListener('click', function () {
            addBookToCompleted(bookObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');
        trashButton.innerText = 'Hapus buku'

        trashButton.addEventListener('click', function () {
            removeBookFromCompleted(bookObject.id);
            alert('Buku sudah dihapus dari rak');
        });

        container.append(completeButton, trashButton);
    }
    return container;

}

function addBookToCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBook(bookId) {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null
}

function removeBookFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return;
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function undoBookFromCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;
    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }
    return -1
}

function saveData() {
    if (isStorageExist()) {
        /* konversi data object ke string agar bisa disimpan */
        const parsed = JSON.stringify(books);
        /* SIMPAN DATA KE STORAGE KEY */
        localStorage.setItem(STORAGE_KEY, parsed);
        /* mempermudah debugging atau tracking */
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

window.addEventListener('change', function () {
    const value = document.getElementById('inputBookIsComplete').checked;
    console.log(value);
    const target = document.getElementById('bookSubmit');
    console.log(target);
    if (value) {
        target.innerText = 'Masukan buku ke rak sudah dibaca'
    } else {
        target.innerText = 'Masukan buku ke rak belum dibaca'
    }
})

/* sebuah listener yang akan menjalankan kode yang ada didalamnya ketika event DOMContentLoaded dibangkitkan alias 
ketika semua elemen HTML sudah dimuat menjadi DOM dengan baik. */
document.addEventListener('DOMContentLoaded', function () {
    /* panggil fungsi pada saat semua elemen HTML sudah selesai dimuat menjadi DOM */
    const submitAction = document.getElementById('form');
    submitAction.addEventListener('submit', function (event) {
        /* MENCEGAH DATA HILANG KETIKA DIMUAT ULANG */
        event.preventDefault();
        /* FUNGSI UNTUK MENAMBAHKAN BUKU BARU */
        addBook();
    });
    if (isStorageExist()) {
        loadDataFromStorage();
    }
    //
    const value = document.getElementById('inputBookIsComplete').checked;
    console.log(value);
    const target = document.getElementById('valueTarget');
    console.log(target);
});

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});
/* TERAPAN FUNGSI */
document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBOOKList = document.getElementById('books');
    uncompletedBOOKList.innerHTML = '';

    const completedBOOKList = document.getElementById('completed-books')
    completedBOOKList.innerHTML = '';

    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);
        if (!bookItem.isComplete)
            uncompletedBOOKList.append(bookElement);
        else
            completedBOOKList.append(bookElement);
    }
});




















