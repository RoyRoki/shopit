import React from 'react'
import { useTheme } from '../../../context/theme'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ThemeToggleButton = () => {
      const { theme, toggleTheme } = useTheme();
  return (
      <button onClick={toggleTheme} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        { theme === 'light' ? (
          <FontAwesomeIcon icon="fa-regular fa-moon" />
        ) : (
          <FontAwesomeIcon icon="fa-regular fa-sun" color='white' />
        )}
      </button>
  )
}

export default ThemeToggleButton
