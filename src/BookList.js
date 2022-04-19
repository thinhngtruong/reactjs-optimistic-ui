import React from 'react';
import classNames from 'classnames';

export default function BookList({
  books,
  favoriteBookId,
  onSetFavoriteBookId,
  selectedBook,
  onSelectBook,
  onDeleteBook
}) {
  return (
    <ul>
      {books.map((book) => (
        <li
          key={book.id}
          className={classNames(
            'flex shadow-md px-3 py-2 rounded bg-white mb-3 cursor-pointer border-2 border-white',
            selectedBook &&
              book.id === selectedBook.id &&
              'bg-blue-100 border-2 border-blue-500',
            book.id < 0 && 'bg-opacity-75'
          )}
          onClick={() => onSelectBook(book)}
        >
          <button
            type="button"
            className="mr-2"
            onClick={(e) => {
              e.stopPropagation();
              onSetFavoriteBookId(book.id);
            }}
          >
            <i
              className={
                book.id === favoriteBookId
                  ? 'far fa-check-circle text-green-500'
                  : 'far fa-circle text-gray-500'
              }
            ></i>
          </button>
          <div className="flex-auto">
            <span className="text-2xl">{book.title}</span> by {book.author}
          </div>
          <button
            type="button"
            className="ml-2 text-blue-400 flex-none"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteBook(book);
            }}
          >
            <i className="far fa-trash-alt"></i>
          </button>
        </li>
      ))}
    </ul>
  );
}
