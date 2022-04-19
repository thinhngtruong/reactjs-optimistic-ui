import { useState } from 'react';
import { toast } from 'react-toastify';

export default function useBookApi({ failRequests = false, delay = 500 }) {
  const [books, setBooks] = useState([
    { id: 0, title: 'Atomic Habits', author: 'James Clear' },
    { id: 1, title: 'Deep Work', author: 'Cal Newport' },
    { id: 2, title: 'Elon Musk', author: 'Ashlee Vance' }
  ]);

  const [favoriteBookId, setFavoriteBookId] = useState(null);

  function updateFavorite(id) {
    const previousFavorite = favoriteBookId;

    setFavoriteBookId(id);

    return fakeFetch({ fail: failRequests, delay }).catch((error) => {
      setFavoriteBookId(previousFavorite);
      throw error;
    });
  }

  function updateBook(book) {
    const previousBooks = books;

    setBooks((prev) => {
      const bookIndex = prev.findIndex((b) => b.id === book.id);
      return [...prev.slice(0, bookIndex), book, ...prev.slice(bookIndex + 1)];
    });

    return fakeFetch({ fail: failRequests, delay }).catch((error) => {
      setBooks(previousBooks);
      throw error;
    });
  }

  function deleteBook(book) {
    const previousBooks = books;

    setBooks((prev) => prev.filter((b) => b.id !== book.id));

    return fakeFetch({ fail: failRequests, delay }).catch((error) => {
      toast.error(`Failed to delete ${book.title}`, {
        autoClose: false,
        hideProgressBar: true
      });

      setBooks(previousBooks);

      throw error;
    });
  }

  function generateId() {
    const min = 1000;
    const max = 9999;
    return Math.floor(Math.random() * (max - min) + min);
  }

  function addBook({ title, author }) {
    const tempId = -1 * generateId();
    const book = { id: tempId, title, author };

    const previousBooks = books;

    // instantly add the book
    setBooks((prev) => [...prev, book]);

    return fakeFetch({ fail: failRequests, delay })
      .then(() => {
        const newBook = { ...book, id: generateId() };
        // update the id of the book after the POST completes
        setBooks((prev) => {
          const bookIndex = prev.indexOf(book);
          return [
            ...prev.slice(0, bookIndex),
            newBook,
            ...prev.slice(bookIndex + 1)
          ];
        });
      })
      .catch((error) => {
        setBooks(previousBooks);
        throw error;
      });
  }

  return {
    books,
    favoriteBookId,
    addBook,
    updateBook,
    updateFavorite,
    deleteBook
  };
}

function fakeFetch({ delay = 500, fail = false } = {}) {
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      if (fail) {
        reject();
      } else {
        resolve();
      }
    }, delay)
  );
}
