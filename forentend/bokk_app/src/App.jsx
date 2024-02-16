import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, NavLink } from 'react-router-dom';
import BookList from './BookList';
import BookDetail from './BookDetail';
import BookForm from './BookForm';
import Home from './Home';

const App = () => {
  return (
    <Router>
      <div>
        <nav className="bg-gray-800 p-4 mb-8">
          <div className="container mx-auto">
            <ul className="flex">
              <li className="mr-6">
                <NavLink to="/" className="text-white hover:text-gray-200">Home</NavLink>
              </li>
              <li className="mr-6">
                <NavLink to="/books" className="text-white hover:text-gray-200">All Books</NavLink>
              </li>
              <li className="mr-6">
                <NavLink to="/books/add" className="text-white hover:text-gray-200">Add Book</NavLink>
              </li>
            </ul>
          </div>
        </nav>

        <Routes>
          <Route path="/books/add" element={<BookForm />} />
          <Route path="/books/:id" element={<BookDetail />} />
          <Route path="/books" element={<BookList />} />
          <Route path="/" element={<Home/>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;