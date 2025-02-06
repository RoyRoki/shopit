import React from "react";
import styles from "./AdminSideMenu.module.css";
import ThemeToggleButton from "../../buttons/toggleButton/ThemeToggleButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBox,
  faChartSimple,
  faHouse,
  faStore,
  faTruck,
} from "@fortawesome/free-solid-svg-icons";
import { adminHeroDiv } from "../../../util/HERODIV";

const AdminSideMenu = ({ curr, setHeroDiv }) => {
  const getNavItemClass = (...heroes) =>
    `${styles.nav_item} ${heroes.includes(curr) ? styles.nav_item_focus : ""}`;
  
  return (
    <div className={styles.sidebar}>
      <div className={styles.group_primary}>
        <div
          className={getNavItemClass(adminHeroDiv.home)}
          onClick={() => setHeroDiv(adminHeroDiv.home)}
        >
          <FontAwesomeIcon icon={faHouse} />
        </div>

        <div
          className={getNavItemClass(adminHeroDiv.store)}
          onClick={() => setHeroDiv(adminHeroDiv.store)}
        >
          <FontAwesomeIcon icon={faStore} />
        </div>

        <div
          className={getNavItemClass(
            adminHeroDiv.addProduct,
            adminHeroDiv.allProduct
          )}
          onClick={() => setHeroDiv(adminHeroDiv.allProduct)}
        >
          <FontAwesomeIcon icon={faBox} />
        </div>

        <div className={styles.nav_item}>
          <FontAwesomeIcon icon={faChartSimple} />
        </div>

        <div
          className={getNavItemClass(adminHeroDiv.orders)}
          onClick={() => setHeroDiv(adminHeroDiv.orders)}
        >
          <FontAwesomeIcon icon={faTruck} />
        </div>
      </div>

      <div className={styles.group_secondary}>
        <div className={styles.nav_item}>
          <ThemeToggleButton />
        </div>
      </div>
    </div>
  );
};

export default AdminSideMenu;
