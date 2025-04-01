import React, { useEffect, useRef, useState } from 'react'
import styles from './SearchBar.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons'
import { useNavigate, useSearchParams } from 'react-router-dom'


const HomeSearchBar = ({ onFocused, isFocused }) => {

  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const [searchParams] = useSearchParams();


  const handleSearch = () => {
    if(query.length > 0) {
      navigate(`/home?query=${query.replace(/\s+/g, "+")}`);
    }
  }

  useEffect(() => {
    if(!searchParams.has("query") ) {
      onFocused(false);
      setQuery("");
    }
  }, [searchParams, onFocused]);

  return (
    <div className={`${styles.search_box} ${isFocused && styles.search_box_focus}`}>
      <FontAwesomeIcon 
        color='var(--bs-tx)' 
        icon={faMagnifyingGlass}
        onClick={() => handleSearch()}
        className={styles.search_icon}
      />
      <input 
        type="text" 
        placeholder='Search...' 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => onFocused(true)}
        onBlur={() => onFocused(query.length !== 0)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSearch()
          }
        }}
      />
      {
        query.length !== 0 && (
          <FontAwesomeIcon 
            icon={faXmark} 
            onClick={() => {
              setQuery("");
              onFocused(false);
            }}
            className={styles.clear_btn}
          />
        )
      }
    </div>
  )
}

export default HomeSearchBar
