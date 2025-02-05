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
import { faBell } from "@fortawesome/free-regular-svg-icons";
import { faBell as faBellSolid } from "@fortawesome/free-solid-svg-icons";
import { faPen } from "@fortawesome/free-solid-svg-icons/faPen";
import { adminHeroDiv } from "../../../util/HERODIV";

const AdminSideMenu = ({ curr, setHeroDiv, notify }) => {
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

        {/* <div className={styles.nav_item}>
          <FontAwesomeIcon icon={faPen} />
        </div> */}
      </div>

      <div className={styles.group_secondary}>
        <div className={styles.nav_item}>
          {notify ? (
            <FontAwesomeIcon icon={faBellSolid} style={{ color: "" }} />
          ) : (
            <FontAwesomeIcon icon={faBell} />
          )}
        </div>
        <div className={styles.nav_item}>
          <ThemeToggleButton />
        </div>
      </div>
    </div>
  );
};

export default AdminSideMenu;
