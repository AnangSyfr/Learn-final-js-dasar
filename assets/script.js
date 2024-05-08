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
    titleElement.classList.add("book-container-heading");
    titleElement.innerText = "Title " + title;

    const authorElement = document.createElement("p");
    authorElement.classList.add("book-container-heading");
    authorElement.innerText = "Author " + author;

    const yearElement = document.createElement("p");
    yearElement.classList.add("book-container-heading");
    yearElement.innerText = "Year " + year;

    const actionElement = document.createElement("div");
    actionElement.classList.add("book-container-btn");

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("btn", "btn-danger");
    deleteButton.innerText = "Delete";
    deleteButton.addEventListener("click", () => onDeleteClick(id));

    const completeButton = document.createElement("button");
    completeButton.classList.add(
      "btn",
      isComplete ? "btn-info" : "btn-success"
    );
    completeButton.addEventListener("click", () =>
      onCompleteClick(id, !isComplete)
    );
    actionElement.appendChild(deleteButton);
    actionElement.appendChild(completeButton);
    const spacerElement = document.createElement("div");
    spacerElement.classList.add("spacer");

    const bookElement = document.createElement("div");
    bookElement.classList.add("book-container");
    bookElement.appendChild(titleElement);
    bookElement.appendChild(authorElement);
    bookElement.appendChild(yearElement);
    bookElement.appendChild(actionElement);

    if (book.isComplete) {
      completeButton.innerText = "Undo";
      bookFinishedContainer.appendChild(bookElement);
      bookFinishedContainer.appendChild(spacerElement);
    } else {
      completeButton.innerText = "Complete";
      bookUnfinishedContainer.appendChild(bookElement);
      bookUnfinishedContainer.appendChild(spacerElement);
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
    id: +new Date(),
    title: judul.value,
    author: penulis.value,
    year: tahun.value,
    isComplete: is_selesai.checked,
  });
  bookForm?.reset();
};
bookForm.addEventListener("submit", onFormSubmit);

const onSearchSubmit = (e) => {
  e.preventDefault();
  const { keyword } = e.target.elements;
  books = JSON.parse(localStorage.getItem("books"));
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().match(keyword.value.toLowerCase())
  );
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
    books = JSON.parse(localBooks);
    renderBookCard();
  }
});
