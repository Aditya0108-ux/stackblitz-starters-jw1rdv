let { getBooks, getBookById, addBook } = require('../book');

describe('Book Functions', () => {
  it('should get all books', () => {
    let books = getBooks();
    expect(books.length).toBe(4);
    expect(books).toEqual([
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
    ]);
  });

  it('should return a book by id', () => {
    let book = getBookById(1);
    expect(book).toEqual({
      id: 1,
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      genre: 'Fiction',
      publication_year: 1960,
    });
  });

  it('should return undefined for a non existant book', () => {
    let book = getBookById(99);
    expect(book).toBeUndefined();
  });

  it('should add a new book', () => {
    let newBook = {
      title: 'New Book',
      author: 'Author Name',
      genre: 'fiction',
      publication_year: 2002,
    };
    let addedBook = addBook(newBook);
    expect(addedBook).toEqual({
      id: 5,
      title: 'New Book',
      author: 'Author Name',
      genre: 'fiction',
      publication_year: 2002,
    });

    const books = getBooks();
    expect(books.length).toBe(5);
  });
});
