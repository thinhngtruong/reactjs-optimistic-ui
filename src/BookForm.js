import React, { useState } from 'react';

export default function BookForm({ onSave, onCancel, ...props }) {
  const [book, setBook] = useState(props.book);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(book);
      }}
    >
      <div>
        <label className="block font-bold">Title</label>
        <input
          type="text"
          className="px-2 py-1 rounded w-full"
          value={book.title}
          onChange={(e) => setBook({ ...book, title: e.target.value })}
        />
      </div>
      <div className="mt-2">
        <label className="block font-bold">Author</label>
        <input
          type="text"
          className="px-2 py-1 rounded w-full"
          value={book.author}
          onChange={(e) => setBook({ ...book, author: e.target.value })}
        />
      </div>
      <button
        type="button"
        className="text-blue-500 underline mr-3"
        onClick={onCancel}
      >
        Cancel
      </button>
      <button className="bg-blue-500 text-white px-2 py-1 rounded mt-2">
        {book.id > -1 ? 'Save' : 'Add'}
      </button>
    </form>
  );
}
