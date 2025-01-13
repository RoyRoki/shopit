import React from 'react'

const HomeProductsGroupInfo = ({ info }) => {
  return (
    <div>
      <h1>{info?.header || "~header~"}</h1>
    </div>
  )
}

export default HomeProductsGroupInfo
