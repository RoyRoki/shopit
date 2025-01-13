import React from 'react'
import UpdateProductImages from './UpdateProductImages'

const UpdateProductMedia = ({ product, onComplete }) => {
  return (
    <div>
      <UpdateProductImages onComplete={onComplete} productId={product.id || 0 } savedUrls={product.imageUrls || []} />
    </div>
  )
}

export default UpdateProductMedia