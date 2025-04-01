import { useEffect } from "react";
import styles from "./PopupNotification.module.css";

const PopupNotification = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); // Auto-close after 3 seconds
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`${styles.popup} ${styles[type]}`}>
      <p>{message}</p>
    </div>
  );
};

export default PopupNotification;
