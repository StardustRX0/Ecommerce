import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Ratings from '../components/Ratings';
import { createProductReview, fetchProductDetail } from "../redux/actions/productActions";
import { resetProductReview } from "../redux/slices/productSlices/productReviewCreateSlice";


const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch()
  const navigate = useNavigate();

  const userLogin = useSelector(state => state.userInfo);
  const { user } = userLogin;

  const productDetail = useSelector((state) => state.productDetail);
  const { error, loading, product, smallImages } = productDetail;

  const productReview = useSelector((state) => state.productReview);
  const { error: reviewError, loading: reviewLoading, success } = productReview;

  const [selectedImage, setSelectedImage] = useState(product?.main_image || null);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (success) {
      dispatch(resetProductReview());
      dispatch(fetchProductDetail(id));
    }
    if (product?.id !== id) {
      dispatch(resetProductReview());
      dispatch(fetchProductDetail(id));
    }
  }, [dispatch, product?.review, id, product?.id, success]);

  useEffect(() => {
    setSelectedImage(smallImages[0]);
  }, [smallImages]);

  const handleSmallImageClick = (smallImage) => {
    setSelectedImage(smallImage);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(createProductReview(
      id, { rating, comment }
    ))
    setComment('');
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const addToCartHandler = () => {
    navigate(`/cart/${id}?qty=${qty}`);
  }

  return (
    <div className='md:mt-8 mt-3 mx-auto px-16 min-h-screen'>
        <button onClick={() => navigate(-1)} className="btn btn-ghost mb-8">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
            Go Back
        </button>
        {loading ? (
          <Loader />
        ):
        error ? (
          <Message color={'bg-red-100'}>{error}</Message>
        ) :
        (
        <div>
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div className="md:w-2/5">
              <div>
                <img 
                src={selectedImage} 
                alt={product.name} 
                className="w-full md:h-96 object-contain"
                />
              </div>
                <div className="w-full p-1 flex mt-2 justify-between">
                  {smallImages.length > 1 && smallImages.map((smallImage, index) => (
                    <img
                      key={index}
                      src={smallImage}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-[23%] h-auto cursor-pointer object-contain"
                      onClick={() => handleSmallImageClick(smallImage)}
                    />
                  ))}
                </div>
            </div>

            <div className="md:w-1/4 mx-4">
              <ul className="list-none p-0">
                <li>
                  <h2 className="text-2xl font-bold mb-8">{product.name}</h2>
                </li>
                <hr className='pb-1'/>
                <li>
                  <Ratings 
                  value={parseInt(product.rating, 10)}
                  edit={false} 
                  text={`${product.numReviews} reviews`} 
                  onChange={(newRating) => setRating(newRating)} 
                  color={'#f8e825'} 
                  />
                </li>
                <hr className='py-1 mt-1'/>
                <li>Price: ${product.price}</li>
                <hr className='py-1 mt-2'/>
                <li>Description: {product.description}</li>
              </ul>
            </div>

            <div className="md:w-1/4 mx-0">
              <ul className="list-none p-0">
                <li className="flex justify-between">
                  <span>Price:</span>
                  <strong>${(product.price*qty).toFixed(2)}</strong> 
                </li>
                <hr className='mt-2 pb-2'/>
                <li className="flex justify-between">
                  <span>Status:</span>
                  {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                </li>
                <hr className='mt-2 pb-2'/>
                {product.countInStock > 0 && (
                  <li className="flex justify-between">
                    <span>Qty</span>
                    <select
                      value={qty}
                      onChange={(e) => setQty(e.target.value)}
                      className="select select-sm select-bordered w-2/6 max-w-xs"
                    >
                      {[...Array(product.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                    
                  </li>
                )}
                <li>
                <hr className='mt-2 pb-2'/>
                  <button
                    className="w-full btn"
                    disabled={product.countInStock === 0}
                    type="button"
                    onClick={addToCartHandler}
                  >
                    Add to Cart
                  </button>
                </li>
              </ul>
            </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="md:w-2/5">
            <h3 className='text-xl font-bold py-8'>Reviews</h3>
            {product && product.reviews && product.reviews.length === 0 && <Message color={'bg-blue-100'}>No Reviews</Message>}
            <div className="mx-0 mb-5">
              <ul className="list-none p-0">
                {product && product.reviews && product.reviews.map((review) => (
                  <li key={review.id} className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-lg">{review.name}</p>
                      <span className="text-gray-500">{review.createdAt.substring(0, 10)}</span>
                    </div>
                    <Ratings 
                      value={parseInt(review.rating, 10)}
                      edit={false}
                    />
                    <p className='mt-4 text-gray-800'>{review.comment}</p>
                    <hr className='my-3 border-t border-gray-300'/>
                  </li>
                ))}
              </ul>
            </div>
            <h3 className='text-xl font-bold py-2'>Write A Review</h3>
            {success && <Message color={'bg-blue-100'}>Review Submitted</Message>}
            {reviewError && <Message color={'bg-red-100'}>{reviewError}</Message>}
            {user ? (
            <form onSubmit={submitHandler} className="mb-5">
                <Ratings setRating={setRating} />
                <div className="form-group">
                  <textarea 
                  value={comment}
                  placeholder="Review"
                  className="textarea textarea-bordered textarea-md w-full my-2"
                  onChange={(e) => setComment(e.target.value)}
                  >
                  </textarea>
               </div>
               {reviewLoading ? 
               <button disabled className="btn w-2/6">
                  <span className="loading loading-spinner"></span>
                    Submitting
                </button> : 
                <button 
               className="btn w-2/6"
               type="submit"
               >
                Submit
               </button>}
            </form>
            ): (
              <Message color={'bg-blue-100'}>Please <Link to='/login'>login</Link> to write a review</Message>
            )}
          </div>
        </div>
      </div>
      )}
    </div>
    )
  };

export default ProductDetailPage;
