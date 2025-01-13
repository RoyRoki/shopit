import React, { useState } from 'react'
import Categories from '../Categories'
import ShowTable from '../ShowTable'
import UpdateImages from './UpdateProductImages';
import UpdateProductMedia from './UpdateProductMedia';
import { useDispatch } from 'react-redux';
import { fetchStoreProducts } from '../../features/admin/storeProductsSlice';
import { converter } from '../../helper/Converter';

const StoreProduct = ({ product, onEdit }) => {

  const dispatch = useDispatch();
  const [showManegeMedia, setShowManegeMedia] = useState(false);

  const onCompleteProductMedia = async () => {
    const handleComplete = async () => {
      dispatch(fetchStoreProducts());
    }
    handleComplete();
    setShowManegeMedia(!showManegeMedia);
  }

  return (
    <div className='m-5 p-2 border-solid border-2 border-blue-700 rounded-md'>
      <div className='grid grid-flow-col p-3 text-white bg-slate-600'>
            <h2>product Id:{product.id || '000'}</h2>
            <h2>{product.name || '~name~'}</h2>
            <button onClick={() => onEdit(product)} key={product.id} >✏️  Edit </button>
            <button onClick={() => setShowManegeMedia(!showManegeMedia)}>{showManegeMedia?"X":"Manege Media"}</button>
      </div>
      {showManegeMedia ? (
        <UpdateProductMedia onComplete={onCompleteProductMedia} product={product}/>
      ) : (
        <div className='grid grid-cols-3 gap-1'>
            <p>{product.description || '---'}</p>
            <p>prices: {product.prices || '-001'}</p>
            <p>discount: {product.discount || '0.0'}</p>
            <p>stock: {product.stock || '000'}</p>
            <h3>{product.isActive ? '🟢Active' : '🔴Inactive'}</h3>

            <div>
              <h3>Categories: </h3>
              {
                product.categories?.map((category) => {
                return (
                  <div key={category.id} className='flex border-solid border-2'>
                    <h3>{category.id}{')_'}</h3>
                    <h3>{category.name}</h3>
                  </div>
                )
              })}
            </div>  

            <div>
              <h3>Keywords: </h3>
              {
                product.keywords?.map((keyword, index) => {
                return (
                  <div key={index} className='border-dotted border-2'>
                    <h2>{keyword.word}</h2>
                  </div>
                )
              })}
            </div>

            <div>
              <h3>Images:</h3>
              <div>
                  {product.imageUrls?.map((imageUrl, index) => {
                  return (
                    <img
                      key={index} 
                      className='max-h-10 max-w-15' 
                      src={imageUrl}
                      alt={`Product ${index}`}/>
                  )
              })}
              </div>
            </div>

            <div>
              <h3>Videos: </h3>
              <div>
                  {product.videoUrls?.map((videoUrl, index) => {
                  return (
                    <video key={index} className='max-h-5 max-w-5' controls>
                      <source src={videoUrl} type="video/mp4"/>
                    </video>
                  )
              })}
              </div>
            </div>
            <ShowTable key={product.id} tableDto={product.tableDto || {}} />

            <div className='border-2 border-solid'>
              <p>length: {product.length}</p>
              <p>width: {product.width}</p>
              <p>height: {product.height}</p>
              <p>weight: {product.weight}</p>
              <p>material: {product.material}</p>
            </div>

            <div>
              <p>created at: {converter.ISO_To_DataTime(product.createdAt) || '2025'}</p>
              <p>updated at: {converter.ISO_To_DataTime(product.updatedAt) || '2025'}</p>
            </div>
      </div>
      )}
      
    </div>
  )
}

export default StoreProduct
