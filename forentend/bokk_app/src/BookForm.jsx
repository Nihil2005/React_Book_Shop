// components/BookForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const BookForm = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publisher, setPublisher] = useState('');
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('author', author);
    formData.append('publisher', publisher);
    formData.append('image', image);

    try {
      await axios.post('http://localhost:4000/books', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      // Redirect to book list page after adding a new book
      window.location.href = '/books';
    } catch (error) {
      setError('Error creating book: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 px-4 py-8 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-6">Add New Book</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">Title:</label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="border border-gray-400 rounded py-2 px-4 w-full outline-none" required />
        </div>
        <div className="mb-4">
          <label htmlFor="author" className="block text-gray-700 text-sm font-bold mb-2">Author:</label>
          <input type="text" id="author" value={author} onChange={(e) => setAuthor(e.target.value)} className="border border-gray-400 rounded py-2 px-4 w-full outline-none" required />
        </div>
        <div className="mb-4">
          <label htmlFor="publisher" className="block text-gray-700 text-sm font-bold mb-2">Publisher:</label>
          <input type="text" id="publisher" value={publisher} onChange={(e) => setPublisher(e.target.value)} className="border border-gray-400 rounded py-2 px-4 w-full outline-none" required />
        </div>
        <div className="mb-4">
          <label htmlFor="image" className="block text-gray-700 text-sm font-bold mb-2">Image:</label>
          <input type="file" id="image" onChange={(e) => setImage(e.target.files[0])} className="border border-gray-400 rounded py-2 px-4 w-full outline-none" required />
        </div>
        <div className="flex items-center justify-between">
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" disabled={isSubmitting}>Submit</button>
          <Link to="/books" className="text-gray-600 font-semibold hover:text-gray-800">Cancel</Link>
        </div>
        {error && <div className="text-red-500 mt-4">{error}</div>}
      </form>
    </div>
  );
};

export default BookForm;
