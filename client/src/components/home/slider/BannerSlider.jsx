import React, { useEffect, useState } from 'react'
import { useTheme } from '../../../context/theme'
import styles from './BannerSlider.module.css'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { faCircleDot } from '@fortawesome/free-regular-svg-icons';

const BannerSlider = ({ slidesItems }) => { // slides[{url, header, onClick}]

      const { theme } = useTheme();
      // For Demo
      const [slides, setSlides] = useState([]);

      useEffect(() => {
            if(theme === 'dark') {
                  setSlides( [
            {     url: 'banner/b1.jpg'
                  ,header: "Fashion sale"
            },
            {
                  url: "banner/b2.jpg",
                  header: "Fashion sale"
            },
            {
                  url: "banner/b1.jpg",
                  header: "Fashion sale"
            },
            {
                  url: "banner/b2.jpg",
                  header: "Fashion sale"
            },
            {
                  url: "banner/b1.jpg",
                  header: "Fashion sale"
            },
            {
                  url: "banner/b2.jpg",
                  header: "Fashion sale"
            }
                        ]);
            }
            if(theme === 'light') {
                  setSlides([
            {     url: 'banner/bd1.jpg'
                  ,header: "Fashion sale"
            },
            {
                  url: "banner/bd2.jpg",
                  header: "Fashion sale"
            },
            {
                  url: "banner/bd1.jpg",
                  header: "Fashion sale"
            },
            {
                  url: "banner/bd2.jpg",
                  header: "Fashion sale"
            },
            {
                  url: "banner/bd1.jpg",
                  header: "Fashion sale"
            },
            {
                  url: "banner/bd2.jpg",
                  header: "Fashion sale"
            }
                        ]);
            }
      },[theme]);

      const [currentIndex, setCurrentIndex] = useState(0);

      // Auto-change the banner every 3 seconds
      useEffect(() => {
            const interval = setInterval(() => {
                  setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
            }, 3000);

            // Cleanup on unmount
            return () => clearInterval(interval);
      }, [slides?.length])

  return (
    <div className={styles.slider}>
      <div className={styles.slider_wrap}>
            <FontAwesomeIcon 
                  color='white' 
                  icon={faAngleLeft} 
                  className={styles.arrow_left} 
                  onClick={() => setCurrentIndex(((currentIndex - 1 + slides.length) % (slides.length)))}
            />
            { slides?.map((slide, index) => (
                  <div 
                        key={index}
                        style={{backgroundImage: `url(${slide?.url})`}}
                        className={`${styles.slider_show} ${currentIndex === index ?  styles.slider_show_active : ''}`}
                  >
                  <span>{slide.header}</span>
                  </div>
            ))}
            <FontAwesomeIcon 
                  color='white' 
                  icon={faAngleRight} 
                  className={styles.arrow_right} 
                  onClick={() => setCurrentIndex(((currentIndex + 1) % (slides.length)))} 
            />
      </div>
      <div className={styles.dot_container}>
            {slides?.map((slide, index) => (
                  <div className={styles.dot_style} key={index}>
                        {index === currentIndex ? (
                              <FontAwesomeIcon  
                                    icon="fa-solid fa-circle"
                                    onClick={() => setCurrentIndex(index)} 
                              />
                        ) : (
                              <FontAwesomeIcon 
                                    icon={faCircle}
                                    onClick={() => setCurrentIndex(index)}
                              />
                        )}
                  </div>
            ))}
      </div>
    </div>
  )
}

export default BannerSlider
