let books = [];
const bookForm = document.getElementById("bookshelf-form");
const searchForm = document.getElementById("bookshelf-search-form");
const editForm = document.getElementById("bookshelf-edit-form");
const bookFinishedContainer = document.getElementById("book-finished");
const bookUnfinishedContainer = document.getElementById("book-unfinished");
const localBooks = localStorage.getItem("books");
const modalEdit = document.getElementById("modal-edit");
const btnCloseEdit = document.getElementById("btn-close-edit");
const edtBookId = document.getElementById("edt_id");
const edtBookTitle = document.getElementById("edt_judul");
const edtBookAuthor = document.getElementById("edt_penulis");
const edtBookYear = document.getElementById("edt_tahun");
const edtBookIsComplete = document.getElementById("edt_is_selesai");

const toggleEditModal = (action) => {
  if (action) {
    modalEdit.classList.remove("modal-close");
    modalEdit.classList.add("modal-open");
  } else {
    modalEdit.classList.remove("modal-open");
    modalEdit.classList.add("modal-close");
  }
};
btnCloseEdit.addEventListener("click", () => toggleEditModal(false));

const onEditBtnClick = (book) => {
  const { id, title, author, year, isComplete } = book;
  edtBookId.value = id;
  edtBookTitle.value = title;
  edtBookAuthor.value = author;
  edtBookYear.value = year;
  edtBookIsComplete.checked = isComplete;
  toggleEditModal(true);
};

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

    const editButton = document.createElement("button");
    editButton.classList.add("btn", "btn-primary");
    editButton.innerText = "Edit";
    editButton.addEventListener("click", () => onEditBtnClick(book));

    const completeButton = document.createElement("button");
    completeButton.classList.add(
      "btn",
      isComplete ? "btn-info" : "btn-success"
    );
    completeButton.addEventListener("click", () =>
      onCompleteClick(id, !isComplete)
    );

    actionElement.appendChild(editButton);
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

const onEditFormSubmit = (e) => {
  e.preventDefault();
  const { edt_id, edt_judul, edt_penulis, edt_tahun, edt_is_selesai } =
    e.target.elements;
  const filteredBooks = books.filter((book) => book.id != edt_id.value);
  let selectedBook = books.find((book) => book.id == edt_id.value);
  selectedBook = {
    id: selectedBook.id,
    title: edt_judul.value,
    author: edt_penulis.value,
    year: edt_tahun.value,
    isComplete: edt_is_selesai.checked,
  };
  books = [...filteredBooks, selectedBook];
  saveBook();
  renderBookCard();
  toggleEditModal(false);
};
editForm.addEventListener("submit", onEditFormSubmit);

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
  const isConfirm = confirm("Apakah anda yakin ingin menghapus ini?");
  if (isConfirm) {
    const filteredBooks = books.filter((book) => book.id !== id);
    books = filteredBooks;
    saveBook();
    renderBookCard();
  } else {
    return;
  }
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
