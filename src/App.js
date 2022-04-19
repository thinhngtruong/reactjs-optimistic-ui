/*
  Hello! Check out the article that goes along
  with this sandbox:

  https://derekndavis.com/posts/lightning-fast-front-end-build-optimistic-ui
*/
import React, { useState } from 'react';
import classNames from 'classnames';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import BookList from './BookList';
import BookForm from './BookForm';
import useBookApi from './useBookApi';

export default function App() {
  const [apiDelay, setApiDelay] = useState(500); // simulate 500ms API calls
  const [failRequests, setFailRequests] = useState(false);
  const {
    books,
    favoriteBookId,
    updateBook,
    addBook,
    deleteBook,
    updateFavorite
  } = useBookApi({
    failRequests,
    delay: apiDelay
  });
  const [selectedBook, setSelectedBook] = useState(null);

  function onSave(book) {
    setSelectedBook(null);

    // add or update the book
    const promise = book.id >= 0 ? updateBook(book) : addBook(book);

    // handle errors in the same way for add and update
    promise.catch(() => {
      toast.error(
        <ErrorToast
          message={`An error occurred saving ${book.title}.`}
          // reset the book as selected, so the user can try again
          onTryAgain={() => setSelectedBook(book)}
        />,
        { autoClose: false }
      );
    });
  }

  return (
    <div className="bg-gray-200">
      <div className="px-3 py-2 bg-blue-200">
        <label className="mr-5">
          <input
            type="checkbox"
            checked={failRequests}
            onChange={(e) => setFailRequests(e.target.checked)}
          />{' '}
          Fail Requests
        </label>
        <label className="mr-2">API Delay</label>
        <input
          className="w-24 px-2 py-1 rounded"
          type="number"
          value={apiDelay}
          onChange={(e) => setApiDelay(Number(e.target.value))}
        />{' '}
        <span>ms</span>
      </div>
      <div className="p-5">
        <div className="flex">
          <div className="w-2/3 pr-3">
            <BookList
              books={books}
              favoriteBookId={favoriteBookId}
              onSetFavoriteBookId={(bookId) => {
                updateFavorite(bookId).catch(() => {});
              }}
              selectedBook={selectedBook}
              onSelectBook={(book) => {
                setSelectedBook(book === selectedBook ? null : book);
              }}
              onDeleteBook={(book) => {
                if (book.id === selectedBook?.id) {
                  setSelectedBook(null);
                }
                deleteBook(book).catch(() => {});
              }}
            />
            <button
              className="text-blue-500"
              onClick={() => setSelectedBook({ title: '', author: '' })}
            >
              + Add
            </button>
          </div>
          <div
            className={classNames(
              'w-1/3 p-3 rounded',
              selectedBook && 'bg-gray-400'
            )}
          >
            {selectedBook ? (
              <BookForm
                key={selectedBook.id}
                book={selectedBook}
                onSave={onSave}
                onCancel={() => setSelectedBook(null)}
              />
            ) : null}
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
}

function ErrorToast({ message, onTryAgain, closeToast }) {
  return (
    <div>
      <div className="w-64">{message}</div>
      <footer className="text-right">
        <button
          type="button"
          className="bg-red-100 text-red-500 px-2 py-1 rounded"
          onClick={() => {
            onTryAgain();
            closeToast();
          }}
        >
          Try again
        </button>
      </footer>
    </div>
  );
}
