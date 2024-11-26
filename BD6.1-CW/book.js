let books = [
  {
    id: 1,
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    genre: 'Fiction',
    publication_year: 1960,
  },
  {
    id: 2,
    title: '1984',
    author: 'George Orwell',
    genre: 'Dystopian',
    publication_year: 1949,
  },
  {
    id: 3,

    title: 'Animal Farm',
    author: 'George Orwell',
    genre: 'Political Satire',
    publication_year: 1945,
  },
  {
    id: 4,
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    genre: 'Fiction',
    publication_year: 1813,
  },
];

function getBooks() {
  return books;
}

function getBookById(id) {
  return books.find((book) => book.id === id);
}

function addBook(book) {
  let newBook = { id: books.length + 1, ...book };
  books.push(newBook);
  return newBook;
}

module.exports = {
  getBooks,
  getBookById,
  addBook,
};
