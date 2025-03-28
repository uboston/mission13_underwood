// Import the book type and useState, useEffect, and bootstrap hooks from React.
import { book } from '../types/book';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useCart } from '../context/CartContext';
import { CartItem } from '../types/cartItem';


function BookList({ selectedCategories }: { selectedCategories: string[] }) {
  const [books, setBooks] = useState<book[]>([]);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const navigate = useNavigate();

  const { addToCart } = useCart();

  const addBookToCart = (book:book) => {
    const newItem: CartItem = {
      bookId: book.bookId,
      bookTitle: book.title,
      bookPrice: book.price,
      quantity: 1,
    };
    addToCart(newItem);
    navigate('/cart');
  };

  useEffect(() => {
    // Fetch books from the backend API.
    const fetchBooks = async () => {
      const categoryParams = selectedCategories
        .map((category) => `category=${encodeURIComponent(category)}`)
        .join('&');
      const response = await fetch(
        `https://localhost:5000/book?pageSize=${pageSize}&pageNumber=${pageNumber}&${categoryParams}`
      );
      // const response = await fetch(`https://localhost:5000/book?pageSize=${pageSize}&pageNumber=${pageNumber}`);
      const data = await response.json();
      setBooks(data.books);
      setTotalElements(data.totalBooks);
      setTotalPages(Math.ceil(data.totalBooks / pageSize));
    };
    fetchBooks();
  }, [pageSize, pageNumber, totalElements, selectedCategories]);

  // Function to sort books
  const sortBooks = () => {
    const sorted = [...books].sort((a, b) =>
      sortOrder === 'asc'
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title)
    );
    setBooks(sorted);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="table-container">
      <div className="table-responsive">
        <table className="table table-striped table-hover table-dark border-light text-center">
          <thead>
            <tr>
              <th
                style={{ cursor: 'pointer', width: '20%' }}
                onClick={sortBooks}
              >
                Title {sortOrder === 'asc' ? '▲' : '▼'}
              </th>
              <th style={{ width: '15%' }}>Author</th>
              <th style={{ width: '15%' }}>Publisher</th>
              <th style={{ width: '10%' }}>ISBN</th>
              <th style={{ width: '10%' }}>Classification</th>
              <th style={{ width: '10%' }}>Category</th>
              <th style={{ width: '10%' }}>Page Count</th>
              <th style={{ width: '10%' }}>Price</th>
              <th style={{ width: '10%' }}>Buy</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.bookId}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.publisher}</td>
                <td>{book.isbn}</td>
                <td>{book.classification}</td>
                <td>{book.category}</td>
                <td>{book.pageCount}</td>
                <td>${book.price}</td>
                <td><button className="btn btn-success" onClick={() => addBookToCart(book)}>Add to Cart</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination-container">
        <button
          className="btn btn-secondary"
          disabled={pageNumber === 1}
          onClick={() => setPageNumber(pageNumber - 1)}
        >
          Previous
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            className={`btn ${pageNumber === index + 1 ? 'btn-primary' : 'btn-outline-light'}`}
            onClick={() => setPageNumber(index + 1)}
            disabled={pageNumber === index + 1}
          >
            {index + 1}
          </button>
        ))}
        <button
          className="btn btn-secondary"
          disabled={pageNumber === totalPages}
          onClick={() => setPageNumber(pageNumber + 1)}
        >
          Next
        </button>
      </div>

      {/* Results per page dropdown */}
      <div className="text-center">
        <label className="me-2">Results per page:</label>
        <select
          className="form-select w-auto d-inline-block bg-dark text-light border-light"
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
        </select>
      </div>
    </div>
  );
}

export default BookList;
