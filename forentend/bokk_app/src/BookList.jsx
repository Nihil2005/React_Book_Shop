import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const BookList = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:4000/books')
      .then(response => {
        setBooks(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching books:', error);
      });
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h2 className="text-3xl font-semibold mb-6">All Books</h2>
      <Link to="/add-book" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 inline-block">Add New Book</Link>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map(book => (
          <div key={book._id} className="bg-white shadow-lg rounded-lg overflow-hidden">
            <img className="w-full h-48 object-cover" src={`http://localhost:4000${book.imagePath}`} alt={book.title} />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{book.title}</h3>
              <p className="text-gray-600">Author: {book.author}</p>
            </div>
            <div className="p-4 bg-gray-100 border-t border-gray-200">
              <Link to={`/books/${book._id}`} className="text-blue-500 font-semibold hover:text-blue-700">View Details</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookList;
