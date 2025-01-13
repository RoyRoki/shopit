import React from 'react'

const ErrorComponent = ({ error , massage }) => {
  return (
    <>
      {error && (
            <>
                  <h3>Error: {error}</h3>
                  <p>Msg: {massage}</p>
            </>
      )}
    </>  
  )
}

export default ErrorComponent
