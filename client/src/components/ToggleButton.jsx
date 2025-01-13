import React from 'react'

const ToggleButton = ({ toggle, setToggle, forTrueText, forFalseText }) => {
  return (
      <button 
          className='m-3 border-2 border-black border-solid rounded-lg bg-blue-800 text-white' 
          onClick={(e) => 
                        {e.preventDefault(); 
                        setToggle(!toggle)}}>

          { toggle ? `${forTrueText}` : `${forFalseText}` }
      </button>
  )
}

export default ToggleButton