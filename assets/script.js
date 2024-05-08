let books = [];
const bookForm = document.getElementById("bookshelf-form");
const searchForm = document.getElementById("bookshelf-search-form");
const bookFinishedContainer = document.getElementById("book-finished");
const bookUnfinishedContainer = document.getElementById("book-unfinished");
const localBooks = localStorage.getItem("books");

const renderBookCard = () => {
  bookFinishedContainer.innerHTML = "";
  bookUnfinishedContainer.innerHTML = "";
  for (let book of books) {
    const { id, title, author, year, isComplete } = book;
    const titleElement = document.createElement("p");
    titleElement.innerText = "title " + title;
    const authorElement = document.createElement("p");
    authorElement.innerText = "author " + author;
    const yearElement = document.createElement("p");
    yearElement.innerText = "year " + year;
    const deleteElement = document.createElement("button");
    deleteElement.innerText = "Delete";
    deleteElement.addEventListener("click", () => onDeleteClick(id));
    const completeElement = document.createElement("button");
    completeElement.addEventListener("click", () =>
      onCompleteClick(id, !isComplete)
    );

    const bookElement = document.createElement("div");
    bookElement.appendChild(titleElement);
    bookElement.appendChild(authorElement);
    bookElement.appendChild(yearElement);
    bookElement.appendChild(deleteElement);
    bookElement.appendChild(completeElement);

    if (book.isComplete) {
      completeElement.innerText = "Undo";
      bookFinishedContainer.appendChild(bookElement);
    } else {
      completeElement.innerText = "Complete";
      bookUnfinishedContainer.appendChild(bookElement);
    }
  }
};

const saveBook = () => {
  localStorage.setItem("books", JSON.stringify(books));
};

const newBook = (book) => {
  books.push(book);
  saveBook();
  renderBookCard();
};

const onFormSubmit = (e) => {
  e.preventDefault();
  const { judul, penulis, tahun, is_selesai } = e.target.elements;
  newBook({
    id: new Date(),
    title: judul.value,
    author: penulis.value,
    year: tahun.value,
    isComplete: is_selesai.checked,
  });
};
bookForm.addEventListener("submit", onFormSubmit);

const onSearchSubmit = (e) => {
  e.preventDefault();
  const { keyword } = e.target.elements;
  books = JSON.parse(localStorage.getItem("books"));
  const filteredBooks = books.filter((book) => book.title.match(keyword.value));
  books = filteredBooks;
  renderBookCard();
};
searchForm.addEventListener("submit", onSearchSubmit);

const onDeleteClick = (id) => {
  const filteredBooks = books.filter((book) => book.id !== id);
  books = filteredBooks;
  saveBook();
  renderBookCard();
};

const onCompleteClick = (id, isComplete = true) => {
  const filteredBooks = books.filter((book) => book.id !== id);
  const selectedBook = books.find((book) => book.id === id);
  selectedBook.isComplete = isComplete;
  books = [...filteredBooks, selectedBook];
  saveBook();
  renderBookCard();
};

window.addEventListener("DOMContentLoaded", () => {
  if (localBooks != "" && JSON.parse(localBooks)) {
    saveBook();
    renderBookCard();
  }
});
