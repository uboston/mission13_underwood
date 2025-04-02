import { book } from '../types/book';

interface FetchBooksResponse {
  books: book[];
  totalBooks: number;
}

const API_URL = 'https://localhost:5000/book';

export const fetchBooks = async (
  pageSize: number,
  pageNumber: number,
  selectedCategories: string[]
): Promise<FetchBooksResponse> => {
  const categoryParams = selectedCategories
    .map((category) => `category=${encodeURIComponent(category)}`)
    .join('&');
  const response = await fetch(
    `${API_URL}?pageSize=${pageSize}&pageNumber=${pageNumber}&${categoryParams}`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch books');
  }
  return await response.json();
};

export const addBook = async (newBook: book): Promise<book> => {
  try {
    const response = await fetch(`${API_URL}/AddBook?`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newBook),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to add book: ${response.status} ${response.statusText}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error('Error adding book:', error);
    throw error;
  }
};

export const updateBook = async (
  bookId: number,
  updatedBook: book
): Promise<book> => {
  const response = await fetch(`${API_URL}/UpdateBook/${bookId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedBook),
  });
  if (!response.ok) {
    throw new Error('Failed to update book');
  }
  return await response.json();
};


export const deleteBook = async (bookId: number): Promise<void> => {
  const response = await fetch(`${API_URL}/DeleteBook/${bookId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete book');
  }
}