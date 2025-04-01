import React, { useState } from "react";
import styles from "./NavberMb.module.css";
import { NavLink, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import {
  faBars,
  faCartShopping,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import ThemeToggleButton from "../../buttons/toggleButton/ThemeToggleButton";
import HomeSearchBar from "../../searchbar/HomeSearchBar";
import ExploreBox from "../exploreBox/ExploreBox";

const NavberMb = ({ isLogged }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <header className={styles.mb_header}>
      <div className={styles.header_wrap}>
        <div className={styles.logo_wrap}>
          <div
            className={styles.hamburger}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
          </div>
          <div className={styles.hdt_logo}>
            <li>
              <NavLink
                to={`/home`}
                className={({ isAction, isPending }) =>
                  isPending
                    ? "nav_link_pending"
                    : isAction
                    ? "nav_link_action"
                    : " "
                }
                onClick={() => setMenuOpen(false)}
              >
                ShopIt
              </NavLink>
            </li>
          </div>
        </div>
        <div
          className={`${styles.quick_action_wrap} ${menuOpen && styles.hide}`}
        >
          <Link to={"/cart"}>
            <FontAwesomeIcon
              icon={faCartShopping}
              style={{
                color: `${
                  location.pathname === "/cart" ? "var(--bs-accent)" : ""
                }`,
              }}
              onClick={() => setMenuOpen(false)}
            />
          </Link>
        </div>
      <div className={`${styles.hdt_theme_btn} ${!menuOpen && styles.hide}`}>
            <ThemeToggleButton />
      </div>
      </div>
      {menuOpen && (
        <div className={styles.menu_wrap}>
          <ul className={styles.hdt_menu}>
            {!isLogged && (
              <>
                <li>
                  <NavLink
                    to={`/login`}
                    className={({ isActive, isPending }) =>
                      `${
                        isActive
                          ? styles.nav_link_action
                          : isPending
                          ? styles.nav_link_pending
                          : styles.nav_link_default
                      }`
                    }
                    onClick={() => setMenuOpen(false)}
                  >
                    Login
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to={`/register`}
                    className={({ isActive, isPending }) =>
                      `${
                        isActive &&
                        !new URLSearchParams(window.location.search).has(
                          "admin"
                        )
                          ? styles.nav_link_action
                          : isPending
                          ? styles.nav_link_pending
                          : styles.nav_link_default
                      }`
                    }
                    onClick={() => setMenuOpen(false)}
                  >
                    Register
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to={`/register?admin=true`}
                    className={({ isActive, isPending }) =>
                      `${
                        isActive &&
                        new URLSearchParams(window.location.search).has("admin")
                          ? styles.nav_link_action
                          : isPending
                          ? styles.nav_link_pending
                          : styles.nav_link_default
                      }`
                    }
                    onClick={() => setMenuOpen(false)}
                  >
                    Open Store
                  </NavLink>
                </li>
              </>
            )}
            {isLogged && (
              <li>
                <Link 
                  to={`/${!isLogged ? "login" : "home?profile_view=true"}`} 
                  onClick={() => setMenuOpen(false)}
                >
                  Profile
                </Link>
              </li>
            )}
            <li>
            <Link 
              to={"/cart"}
              onClick={() => setMenuOpen(false)}
            >
              Cart
            </Link>                  
            </li>
            <li>
              <ExploreBox isOpen={isOpen} setIsOpen={setIsOpen} />
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default NavberMb;
