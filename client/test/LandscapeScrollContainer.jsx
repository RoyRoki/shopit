import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import "./LandscapeScrollContainer.css";

const LandscapeScrollContainer = ({ children }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    const handleScroll = (event) => {
      event.preventDefault();
      container.scrollLeft += event.deltaY; // Horizontal scroll on vertical mouse wheel scroll
    };

    container.addEventListener("wheel", handleScroll);

    return () => {
      container.removeEventListener("wheel", handleScroll);
    };
  }, []);

  return (
    <div className="landscape-scroll-container" ref={containerRef}>
      {children}
    </div>
  );
};

LandscapeScrollContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

export default LandscapeScrollContainer;
