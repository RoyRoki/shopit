import React from 'react'
import { useNavigate } from 'react-router-dom'

const KeywordsButtons = ({ keywords }) => {
  const navigate = useNavigate();
  return (
    <div>
      <hr />
      { keywords?.map((keyword, index) => (
        <button 
          key={index}
          className='text-blue-500 ml-5'
          onClick={() => navigate(`/products?keyword=${keyword}`)}
        >
        #{keyword}
        </button>
      ))}
      <hr />
    </div>
  )
}

export default KeywordsButtons
