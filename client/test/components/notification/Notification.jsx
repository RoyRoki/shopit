import React, { useState, useEffect, useRef } from "react";

function Notification() {
  const [cartNotifier, setCartNotifier] = useState(false);
  const timerRef = useRef(null); // Ref to manage timer

  const startNotifier = () => {
    setCartNotifier(true);
    resetTimer(); // Start or reset the timer
  };

  const resetTimer = () => {
    // Clear the existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    // Start a new timer for 10 seconds
    timerRef.current = setTimeout(() => {
      setCartNotifier(false);
    }, 10000);
  };

  const stopTimer = () => {
    // Clear the timer when the user hovers
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  useEffect(() => {
    return () => {
      // Clear the timer when the component unmounts
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <div>
      <button onClick={startNotifier}>Add to Cart</button>
      {cartNotifier && (
        <div
          className="notification"
          onMouseEnter={stopTimer} // Stop the timer when hovered
          onMouseLeave={resetTimer} // Restart the timer when unhovered
        >
          Item added to cart!
        </div>
      )}
    </div>
  );
}

export default Notification;
