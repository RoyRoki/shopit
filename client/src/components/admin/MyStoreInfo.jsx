import React from 'react'

const MyStoreInfo = ({ storeDto }) => {
  return (
    <div className='flex justify-around bg-slate-400 border-dashed border-blue-500 border-2'>
      <h2>{storeDto.name || '~store name~'}</h2>
      <p>{storeDto.email || '~store email~'}</p>
      <p>{storeDto.description || '~store description~'}</p>
      <p>{storeDto.state || '~store state~'}</p>
    </div>
  )
}

export default MyStoreInfo
