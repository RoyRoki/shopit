import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";

const HorizontalScrollContainer = ({ children }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    const handleScroll = (event) => {
      event.preventDefault(); // Prevent default vertical scrolling
      container.scrollLeft += event.deltaY; // Scroll horizontally
    };

    // Attach event listener
    container.addEventListener("wheel", handleScroll);

    // Cleanup event listener
    return () => {
      container.removeEventListener("wheel", handleScroll);
    };
  }, []);

  return (
    <div className="horizontal-scroll-container" ref={containerRef}>
      {children}
    </div>
  );
};

HorizontalScrollContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

export default HorizontalScrollContainer;
