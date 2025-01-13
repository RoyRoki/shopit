import React from 'react'
import Notification from '../components/notification/Notification'
import QuantityDropdown from '../components/selectDropDown/QuantityDropdown'

const TestPage = () => {
  return (
    <div>
      Test
      <div className='debug' style={{color: "red"}}>
      <h1>Test Notification</h1>
      <Notification />
      </div>
      <QuantityDropdown />
    </div>
  )
}

export default TestPage
