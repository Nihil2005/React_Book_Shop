const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const PORT = process.env.PORT || 4000;
const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));

// Connect to MongoDB
const MongoDBURL = "mongodb://localhost:27017/apple";
mongoose.connect(MongoDBURL)
    .then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("Error connecting to MongoDB:", err);
});

// Define the Book model
const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    publisher: {
        type: String,
        required: true
    },
    imagePath: String // Added to store image paths
}, {
    timestamps: true
});

const Book = mongoose.model('Book', bookSchema);

// Multer configuration for handling image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'uploads')); // Save uploads to 'uploads' directory
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Rename file to avoid conflicts
    }
});

const upload = multer({ storage: storage });

// Serve images statically
app.use('/images', express.static(path.join(__dirname, 'uploads')));

// Routes

// Get all books
app.get('/books', async (req, res) => {
    try {
        const books = await Book.find();
        res.json({
            count: books.length,
            data: books
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving books');
    }
});

// Get a specific book by ID
app.get('/books/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).send('Book not found');
        }
        res.json(book);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving book');
    }
});

// Update a book by ID
// Update a book by ID
app.put('/books/:id', upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params;
        let updatedData = {};
        if (req.body.title) updatedData.title = req.body.title;
        if (req.body.author) updatedData.author = req.body.author;
        if (req.body.publisher) updatedData.publisher = req.body.publisher;
        if (req.file) updatedData.imagePath = '/images/' + req.file.filename;

        const updatedBook = await Book.findByIdAndUpdate(id, updatedData, { new: true });
        if (!updatedBook) {
            return res.status(404).send('Book not found');
        }
        res.json({
            message: 'Book updated successfully',
            data: updatedBook
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating book');
    }
});


// Delete a book by ID
app.delete('/books/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBook = await Book.findByIdAndDelete(id);
        if (!deletedBook) {
            return res.status(404).send('Book not found');
        }
        res.json({
            message: 'Book deleted successfully',
            data: deletedBook
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting book');
    }
});

// Create a new book
app.post('/books', upload.single('image'), async (req, res) => {
    try {
        if (!req.body.title || !req.body.author || !req.body.publisher) {
            return res.status(400).send('Missing required fields');
        }

        const newBook = {
            title: req.body.title,
            author: req.body.author,
            publisher: req.body.publisher,
            imagePath: req.file ? '/images/' + req.file.filename : '' // Save image path
        };

        const book = await Book.create(newBook);
        res.status(201).json({
            message: 'Book created successfully',
            data: book
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating book');
    }
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
