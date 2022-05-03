// Book class: represents a book
// eslint-disable-next-line max-classes-per-file
class Book {
  constructor(title, authour, isbn) {
    this.title = title;
    this.authour = authour;
    this.isbn = isbn;
  }
}

// store class: handles storage
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }

    return books;
  }

  static addBook(book) {
    const books = Store.getBooks();

    books.push(book);

    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();

    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem('books', JSON.stringify(books));
  }
}

// UI class: handles UI tasks
class UI {
  static displayBooks() {
    const books = Store.getBooks();

    books.forEach((book) => UI.addBookToList(book));
  }

  static addBookToList(book) {
    const list = document.querySelector('#book-list');

    const row = document.createElement('tr');

    row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.authour}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

    list.appendChild(row);
  }

  static deleteBook(el) {
    if (el.classList.contains('delete')) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createElement('div');
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');
    container.insertBefore(div, form);

    // make error vanish in 3 seconds
    setTimeout(() => document.querySelector('.alert').remove(), 3000);
  }

  static clearFields() {
    document.querySelector('#title').value = '';
    document.querySelector('#authour').value = '';
    document.querySelector('#isbn').value = '';
  }
}

// Event: display book
document.addEventListener('DOMContentLoaded', UI.displayBooks);
// Event: add book
document.querySelector('#book-form').addEventListener('submit', (e) => {
  // prevent default actual submit
  e.preventDefault();

  // get form values
  const title = document.querySelector('#title').value;
  const authour = document.querySelector('#authour').value;
  const isbn = document.querySelector('#isbn').value;

  // validate added book

  if (title === '' || authour === '' || isbn === '') {
    UI.showAlert('please fill in all fields', 'danger');
  } else {
    // instantiate book
    const book = new Book(title, authour, isbn);

    // add books to UI
    //   console.log(book);
    UI.addBookToList(book);

    // add book to store
    Store.addBook(book);

    // show success message
    UI.showAlert('Book Added', 'success');

    // clear fields
    UI.clearFields();
  }
});
// Event: remove book
document.querySelector('#book-list').addEventListener('click', (e) => {
  // remove book from UI
  UI.deleteBook(e.target);

  // remove book from store
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  // show success message
  UI.showAlert('Book Removed', 'success');
});
