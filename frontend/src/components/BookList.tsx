// Import the book type and useState, useEffect, and bootstrap hooks from React.
import { book } from '../types/book';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useCart } from '../context/CartContext';
import { CartItem } from '../types/cartItem';
import { fetchBooks } from '../api/BooksAPI';
import Pagination from './Pagination';

// The enitre book list component (table with pagination and sorting)

function BookList({ selectedCategories }: { selectedCategories: string[] }) {
  const [books, setBooks] = useState<book[]>([]);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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
    const loadBooks = async () => {
      try {
        setLoading(true);
        const data = await fetchBooks(pageSize, pageNumber, selectedCategories);
        setBooks(data.books);
        setTotalPages(Math.ceil(data.totalBooks / pageSize));
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, [pageSize, pageNumber, selectedCategories]);

  if (loading) return <p>Loading projects...</p>
  if (error) return <p className='text-red-500'>Error: {error}</p>;


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
    < Pagination
    currentPage={pageNumber}
    totalPages={totalPages}
    pageSize={pageSize}
    onPageChange={setPageNumber}
    onPageSizeChange={(newSize) => {
      setPageSize(newSize);
      setPageNumber(1); 
    }} /> 
    </div>
  );
}

export default BookList;
