import { useState, useEffect } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { useParams, useNavigate } from 'react-router-dom'
import { productUpdateReset } from '../redux/slices/productSlices/productUpdateSlice'
import { 
  fetchProducts, 
  updateProduct, 
  fetchProductDetail
} from '../redux/actions/productActions'
import { toast } from "react-toastify";


const ProductEditPage = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');
    // const [uploading, setUploading] = useState(false);

    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const productDetails = useSelector(state => state.productDetail);
    const { error, loading, product } = productDetails;

    const productUpdate = useSelector(state => state.productUpdate);
    const { 
      error: errorUpdate, 
      loading: loadingUpdate, 
      success: successUpdate 
    } = productUpdate;

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(updateProduct({
            id,
            name,
            price,
            image,
            brand,
            category,
            countInStock,
            description
        }));
    };

    const uploadFileHandler = async (e, imgStr) => {
        const file = e.target.files[0];
        const formData = new FormData();

        console.log(imgStr);
        formData.append(imgStr, file);
        formData.append('product_id', id);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
            const { data } = await axios.post('/api/products/upload/', formData, config);
            setImage(data);
            toast.success('Image Uploaded');
        } catch (error) {
            toast.error('Something went wrong');
        }
    }

    useEffect(() => {
        if (successUpdate) {
            dispatch(productUpdateReset());
            dispatch(fetchProducts());
            navigate('/admin/productlist');
        } else {
            if (!product.name || product.id !== Number(id)) {
                dispatch(fetchProductDetail(id));
            } else {
                setName(product.name);
                setPrice(product.price);
                setImage(product.image);
                setBrand(product.brand);
                setCategory(product.category);
                setCountInStock(product.countInStock);
                setDescription(product.description);
            }
        }
    }, [dispatch, product, id, navigate, successUpdate]);

    return (
        <div className="mt-8 px-16 mx-auto">
          <div className='mt-4'>
            <h1 className='text-2xl font-bold'>Edit Product</h1>
            {loadingUpdate && <Loader />}
            {errorUpdate && <Message color={alert-error}>{errorUpdate.payload}</Message>}
    
            {loading ? (
              <Loader />
            ) : error ? (
              <Message variant='danger'>{error}</Message>
            ) : (
              <form onSubmit={submitHandler} className='my-4'>
                <div className='mb-4'>
                  <label htmlFor='name' className='block text-sm font-medium text-gray-600'>
                    Name
                  </label>
                  <input
                    type='text'
                    id='name'
                    placeholder='Enter name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className='mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500'
                  />
                </div>
    
                <div className='mb-4'>
                  <label htmlFor='price' className='block text-sm font-medium text-gray-600'>
                    Price
                  </label>
                  <input
                    type='number'
                    id='price'
                    placeholder='Enter price'
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className='mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500'
                  />
                </div>
    
                <div className='mb-4'>
                  <label htmlFor='image' className='block text-sm font-medium text-gray-600'>
                    Main Image
                  </label>
                  <input
                    type='file'
                    id='image-file'
                    label='Choose File'
                    onChange={(e) => {uploadFileHandler(e, 'main_image')}}
                    className='mt-2'
                  />
                </div>

                <div className='mb-4'>
                  <label htmlFor='image_1' className='block text-sm font-medium text-gray-600'>
                    Image_1
                  </label>
                  <input
                    type='file'
                    id='image-file'
                    label='Choose File'
                    onChange={(e) => uploadFileHandler(e, 'image_1')}
                    className='mt-2'
                  />
                </div>

                <div className='mb-4'>
                  <label htmlFor='image_2' className='block text-sm font-medium text-gray-600'>
                    Image_2
                  </label>
                  <input
                    type='file'
                    id='image-file'
                    label='Choose File'
                    onChange={(e) => uploadFileHandler(e, 'image_2')}
                    className='mt-2'
                  />
                </div>

                <div className='mb-4'>
                  <label htmlFor='image_3' className='block text-sm font-medium text-gray-600'>
                    Image_3
                  </label>
                  <input
                    type='file'
                    id='image-file'
                    label='Choose File'
                    onChange={(e) => uploadFileHandler(e, 'image_3')}
                    className='mt-2'
                  />
                </div>

                <div className='mb-4'>
                  <label htmlFor='brand' className='block text-sm font-medium text-gray-600'>
                    Brand
                  </label>
                  <input
                    type='text'
                    id='brand'
                    placeholder='Enter Brand'
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className='mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500'
                  />
                </div>
                <div className='mb-4'>
                  <label htmlFor='category' className='block text-sm font-medium text-gray-600'>
                    Category
                  </label>
                  <input
                    type='text'
                    id='category'
                    placeholder='Category'
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className='mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500'
                  />
                </div>

                <div className='mb-4'>
                  <label htmlFor='countInStock' className='block text-sm font-medium text-gray-600'>
                    Count in Stock
                  </label>
                  <input
                    type='text'
                    id='countInStock'
                    placeholder='countInStock'
                    value={countInStock}
                    onChange={(e) => setCountInStock(e.target.value)}
                    className='mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500'
                  />
                </div>
                <div className='mb-4'>
                  <label htmlFor='description' className='block text-sm font-medium text-gray-600'>
                    Description
                  </label>
                  <input
                    type='textarea'
                    id='description'
                    placeholder='Description'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className='mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500'
                  />
                </div>
    
                <button type='submit' className='btn max-w-50'>
                  Update
                </button>
              </form>
            )}
          </div>
        </div>
    )
};

export default ProductEditPage;
