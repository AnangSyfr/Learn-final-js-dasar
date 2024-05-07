let books = [];
const bookForm = document.getElementById("bookshelf-form");
const bookFinishedContainer = document.getElementById("book-finished");
const bookUnfinishedContainer = document.getElementById("book-unfinished");
const localBooks = localStorage.getItem("books");

const renderBookCard = () => {
  bookFinishedContainer.innerHTML = "";
  bookUnfinishedContainer.innerHTML = "";
  for (let book of books) {
    const { id, title, author, year } = book;
    const titleElement = document.createElement("p");
    titleElement.innerText = "title" + title;
    const authorElement = document.createElement("p");
    authorElement.innerText = "author " + author;
    const yearElement = document.createElement("p");
    yearElement.innerText = "year " + year;

    const bookElement = document.createElement("div");
    bookElement.appendChild(titleElement);
    bookElement.appendChild(authorElement);
    bookElement.appendChild(yearElement);

    if (book.isComplete) {
      bookFinishedContainer.appendChild(bookElement);
    } else {
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

window.addEventListener("DOMContentLoaded", () => {
  if (localBooks != "" && JSON.parse(localBooks)) {
    books = JSON.parse(localBooks);
    renderBookCard();
  }
});