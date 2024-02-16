import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const BookDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedAuthor, setEditedAuthor] = useState('');
  const [editedPublisher, setEditedPublisher] = useState('');
  const [editedImage, setEditedImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/books/${id}`);
        const { title, author, publisher, imagePath } = response.data;
        setBook(response.data);
        setEditedTitle(title);
        setEditedAuthor(author);
        setEditedPublisher(publisher);
        setEditedImage(imagePath);
      } catch (error) {
        console.error('Error fetching book:', error);
        setError('Error fetching book. Please try again later.');
      }
    };

    fetchData();
  }, [id]);

  const handleEdit = async () => {
    try {
      const formData = new FormData();
      formData.append('title', editedTitle);
      formData.append('author', editedAuthor);
      formData.append('publisher', editedPublisher);
      if (editedImage) {
        formData.append('image', editedImage);
      }

      await axios.put(`http://localhost:4000/books/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setIsEditing(false);
      // Reload book details after editing
      const response = await axios.get(`http://localhost:4000/books/${id}`);
      setBook(response.data);
    } catch (error) {
      console.error('Error updating book:', error);
      setError('Error updating book. Please try again later.');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:4000/books/${id}`);
      // Redirect to the book list page after deleting the book
      window.location.href = '/books';
    } catch (error) {
      console.error('Error deleting book:', error);
      setError('Error deleting book. Please try again later.');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset edited values to original book values
    setEditedTitle(book.title);
    setEditedAuthor(book.author);
    setEditedPublisher(book.publisher);
    setEditedImage(book.imagePath);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-lg mx-auto mt-10 px-4">
      <h2 className="text-3xl font-semibold mb-4">Book Detail</h2>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <img className="w-full h-64 object-cover" src={`http://localhost:4000${editedImage}`} alt={book.title} />
        <div className="p-6">
          {!isEditing ? (
            <div>
              <h3 className="text-2xl font-semibold mb-2">{book.title}</h3>
              <p className="text-gray-600">Author: {book.author}</p>
              <p className="text-gray-600">Publisher: {book.publisher}</p>
              <div className="mt-4">
                <button onClick={() => setIsEditing(true)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
                  Edit
                </button>
                <button onClick={handleDelete} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <div>
              <input type="text" value={editedTitle} onChange={e => setEditedTitle(e.target.value)} className="border border-gray-400 rounded py-2 px-4 w-full mb-2" />
              <input type="text" value={editedAuthor} onChange={e => setEditedAuthor(e.target.value)} className="border border-gray-400 rounded py-2 px-4 w-full mb-2" />
              <input type="text" value={editedPublisher} onChange={e => setEditedPublisher(e.target.value)} className="border border-gray-400 rounded py-2 px-4 w-full mb-4" />
              <input type="file" onChange={e => setEditedImage(e.target.files[0])} className="border border-gray-400 rounded py-2 px-4 w-full mb-4" />
              <div>
                <button onClick={handleEdit} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2">
                  Save
                </button>
                <button onClick={handleCancelEdit} className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
