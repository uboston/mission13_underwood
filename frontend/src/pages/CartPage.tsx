import Banner from '../components/Banner';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useCart } from '../context/CartContext';
import { CartItem } from '../types/cartItem';
// Complete Cart Page

function CartPage () {
    const navigate = useNavigate();
    const {cart, removeFromCart} = useCart();
    const totalPrice = cart.reduce((sum, item) => sum + (item.bookPrice * item.quantity), 0);

    return (
    <>
    < Banner />
    <h2>Your Cart</h2>
    <div>{cart.length === 0 ? <p>Your cart is empty</p> : <ul>
    {cart.map((item : CartItem) => 
        <li key={item.bookId}>
            {item.bookTitle}, Quantity {item.quantity},  Subtotal: $ {(item.bookPrice * item.quantity).toFixed(2)}
            <button onClick={() => removeFromCart(item.bookId)}>Remove</button>
            </li>
        
    )}
    </ul>}</div>
    {cart.length > 0 && (<h3>Total: ${totalPrice.toFixed(2)}</h3>)}
    <button onClick={() => navigate(-1)}>Continue Shopping</button>
    <button>Checkout</button>

    </>
    );
}

export default CartPage;