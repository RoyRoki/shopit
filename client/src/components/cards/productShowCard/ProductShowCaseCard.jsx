import React from 'react'
import styles from './ProductShow.module.css'

const ProductShowCaseCard = ({ product }) => {
  return (
    <div className='border-solid border-2 m-3 mt-10 mb-10 drop-shadow-2xl rounded-lg border-slate-700'>
      <div className=''>
        <h1 className='text-xl ml-4 text-gray-800'>{product.productName || 'name'}</h1>
        <div className='flex justify-start gap-10 m-2'>
          <div className='border-2 border-solid'>
            {product.imageUrls?.slice(0,1).map((imageUrl, index) => {
              return (
                <img 
                  key={index}
                  className='max-h-[200px] max-w-[200px]'
                  src={imageUrl}
                  alt={`product Image`}
                />
              )
            })}
          </div>
          <div>
            <h4 className='text-lg'>{product.description || 'description'}</h4>
          </div>
        </div>
        <div className='flex justify-items-start m-3 gap-[200px]'>
          <div className='flex gap-3'>
            <div className='m-1'>
              <h2 className='font-serif text-lg text-red-600'>{`${product.prices || 0} Rs`}</h2>
              <hr className='w-[4rem] relative bottom-4 ml-2 bg-[rgba(79,79,79,0.35)] h-1 rotate-[-15deg]'/>
              <hr className='w-[4rem] relative bottom-4 ml-2 bg-[rgba(79,79,79,0.4)] h-1 rotate-[15deg]'/>
            </div>
            <h1 className='text-2xl border-solid border-4 rounded-2xl border-green-500'>{`${parseFloat(product.prices - product.prices * product.discount)} Rs`}</h1>
          </div>
          <h2 className='text-lg text-green-600 font-semibold'>{`Discount ${product.discount * 100 || 0}%`}</h2>
        </div>
      </div>
    </div>
  )
}

export default ProductShowCaseCard
