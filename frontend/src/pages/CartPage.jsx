import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Link, 
  useLocation, 
  useParams, 
  useNavigate 
} from 'react-router-dom'
import Message from '../components/Message';
import { addToCart, removeFromCart } from '../redux/actions/cartActions';
import { saveOrderValues } from '../redux/slices/cartSlices/addToCartSlice';


const CartPage = () => {
  const cart = useSelector(state => state.cart);
  const { cartItems } = cart;
  const userLogin = useSelector(state => state.userInfo);
  const { user } = userLogin;

  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }
  
  const { id } = useParams();
  const navigate = useNavigate();
  const query = useQuery();
  const dispatch = useDispatch();
  const qty = Number(query.get('qty'));

  useEffect(() => {
    if (id) {
      dispatch(addToCart(id, qty));
      dispatch(saveOrderValues());
    }
  }, [dispatch, id, qty]);

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
    dispatch(saveOrderValues());
  };

  const checkoutHandler = () => {
    if (!user) {
      navigate('/login?redirect=shipping');
    } else {
      navigate('/shipping');
      dispatch(saveOrderValues());
    }
  };


  return (
    <div className="mx-auto md:mt-8 mt-3 px-16">
      <button onClick={() => navigate(-1)} className="btn btn-ghost md:mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
          Go Back
      </button>
      <h1 className="text-3xl mb-4 py-5 font-bold">SHOPPING CART</h1>
      <div className="flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="md:w-[65%] w-full">
          {cartItems.length === 0 ? (
            <Message color={'bg-blue-100'}>Your cart is empty <Link to='/' className='hover:underline'>  Go Back</Link></Message>
          ) : ( 
            <ul className="list-none p-0">
              {cartItems.map((item) => (
                <li key={item.product} className="mb-4 border-b border-gray-200">
                  <div className="flex flex-wrap items-center justify-between">
                    <div className="w-full sm:w-1/6 mb-2 sm:mb-0 flex items-start align-top">
                      <img src={item.image} alt={item.name} className="w-full h-auto" />
                    </div>
                    <div className="w-full sm:w-2/6 mb-2 sm:mb-0 flex items-start align-top">
                      <Link to={`/product/${item.product}`} className="hover:underline pl-2">{item.name}</Link>
                    </div>
                    <div className="w-full sm:w-1/6 mb-2 sm:mb-0">
                      ${(item.price * item.qty).toFixed(2)}
                    </div>
                    <div className="w-full sm:w-1/6 mb-2 sm:mb-0">
                      <select
                      value={item.qty}
                      onChange={(e) => dispatch(addToCart(item.product, Number(e.target.value)))}
                      className="select select-sm select-bordered w-full"
                      >
                      {[...Array(Math.abs(item.countInStock)).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                      </select>
                    </div>
                    <div className="w-full sm:w-1/12 mb-2 sm:mb-0 flex items-center justify-end">
                      <button
                        type='button'
                        className='hover:text-red-700 focus:outline-none'
                        onClick={() => removeFromCartHandler(item.product)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="md:w-[30%] w-full flex items-center justify-center">
          <div className="p-6 w-full">
            <ul className="list-none p-0">
              <li className="mb-4 border-b border-gray-200 py-3">
                <h2 className="text-xl font-semibold mb-2">SUBTOTAL ({cartItems.reduce((acc, item) => acc + item.qty, 0)} ITEMS)</h2>
                <span className="text-lg font-semibold">${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}</span>
              </li>
              <li className="text-center text-lg">
                <button
                  type='button'
                  className="w-full btn"
                  disabled={cartItems.length === 0}
                  onClick={checkoutHandler}
                >
                  Proceed to Checkout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
