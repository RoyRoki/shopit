import React from 'react'

const LoadingComponent = ({ loading }) => {
  return (
      <>
            { loading && (
                  <h3>Loading ho raha hain .. .. . .</h3>
            )}
      </>

  )
}

export default LoadingComponent
