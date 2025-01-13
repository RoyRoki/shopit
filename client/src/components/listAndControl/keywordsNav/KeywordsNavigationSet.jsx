import React from 'react'
import styles from './KeywordsNavigationSet.module.css'
import { Link } from 'react-router-dom'

const KeywordsNavigationSet = ({ keywords }) => {
  return (
    <div className={styles.nav_box}>
      {keywords?.length !== 0 ? (
            <div className={styles.nav_wrap}>
                  {keywords?.map((keyword, index) => (
                        <Link 
                              className={styles.nav_link}
                              to={`/home?key=${keyword}`}
                              key={index}
                        > <span>#</span>{`${keyword}`}</Link>
                  ))}        
            </div>
      ) : (
            <div className={styles.no_key_wrap}>
                  <Link
                        className={styles.nav_link}
                        to={"/home"}
                  >
                  HOME
                  </Link>
            </div>
      )}
    </div>
  )
}

export default KeywordsNavigationSet
