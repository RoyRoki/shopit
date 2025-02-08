import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "../../../context/theme";
import styles from "./BannerSlider.module.css";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-regular-svg-icons";
import { faCircleDot } from "@fortawesome/free-regular-svg-icons";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons/faMagnifyingGlass";

const BannerSlider = ({ slidesItems }) => {
  const [slides, setSlides] = useState([
    { url: "banner/adsBanner1.png", header: "Fashion sale" },
    {
      url: "banner/adsBanner2.png",
      header: "Fashion sale",
    },
    {
      url: "banner/adsBanner3.png",
      header: "Fashion sale",
    },
  ]);

  const intervalRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const startAutoSlide = () => {
    clearInterval(intervalRef.current); // Clear any existing interval
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);
  };

  const resetTimer = () => {
    startAutoSlide(); // Restart the timer
  };

  useEffect(() => {
    startAutoSlide(); // Start auto-slide initially

    return () => clearInterval(intervalRef.current); // Cleanup on unmount
  }, [slides.length]); // Depend on slides length change

  return (
    <div className={styles.slider}>
      <div className={styles.slider_wrap}>
        <FontAwesomeIcon
          color="white"
          icon={faAngleLeft}
          className={styles.arrow_left}
          onClick={() => {
            resetTimer();
            setCurrentIndex((currentIndex - 1 + slides.length) % slides.length);
          }}
        />
        {slides?.map((slide, index) => (
          <div
            key={index}
            style={{ backgroundImage: `url(${slide?.url})` }}
            className={`${styles.slider_show} ${
              currentIndex === index ? styles.slider_show_active : ""
            }`}
          >
            <div className={styles.inner_wrap}>
              <div className={styles.info_wrap}>
                <p>In this season, find the best 🔥</p>
                <div className={styles.info_header_wrap}>
                  <h2>Exclusive collection</h2>
                  <h2>for everyone</h2>
                </div>
              </div>
              <div className={styles.btn_wrap}>
                <p>Explore now </p>
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </div>
            </div>
          </div>
        ))}
        <FontAwesomeIcon
          color="white"
          icon={faAngleRight}
          className={styles.arrow_right}
          onClick={() => {
            resetTimer();
            setCurrentIndex((currentIndex + 1) % slides.length);
          }}
        />
      </div>
      <div className={styles.ber_container}>
        {slides?.map((slide, index) => (
          <div
            onClick={() => {
              resetTimer();
              setCurrentIndex(index);
            }}
            key={index}
            className={`${styles.ber} ${
              index === currentIndex && styles.ber_active
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default BannerSlider;
