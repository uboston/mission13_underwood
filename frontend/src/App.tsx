import { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import BookPage from './pages/BookPage';
import CartPage from './pages/CartPage';
import { CartProvider } from './context/CartContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminPage from './pages/AdminPage';
// App with pages and routing

function App() {
    // State to track the current theme
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    // On theme change, update the class of the body
    useEffect(() => {
        document.body.classList.remove(theme === 'light' ? 'bg-dark' : 'bg-light');
        document.body.classList.add(theme === 'light' ? 'bg-light' : 'bg-dark');
        document.body.classList.toggle('text-light', theme === 'dark');
        document.body.classList.toggle('text-dark', theme === 'light');
    }, [theme]);

    // Toggle the theme between light and dark
    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <>
        <CartProvider>
            <Router>
                <div className="container">
                    <button
                        onClick={toggleTheme}
                        className="btn btn-primary mt-3"
                    >
                        Toggle to {theme === 'light' ? 'Dark' : 'Light'} Mode
                    </button>
                </div>
                <Routes>
                    <Route path="/" element={<BookPage />} />
                    <Route path="/books" element={<BookPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/admin" element={<AdminPage />} />
                </Routes>
            </Router>
        </CartProvider>
        </>
    );
}

export default App;
