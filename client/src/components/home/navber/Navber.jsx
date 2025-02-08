import React, { useEffect, useRef, useState } from "react";
import styles from "./Navber.module.css";
import { NavLink, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import ThemeToggleButton from "../../buttons/toggleButton/ThemeToggleButton";
import HomeSearchBar from "../../searchbar/HomeSearchBar";
import ExploreBox from "../exploreBox/ExploreBox";

const Navber = ({ isLogged }) => {
  const [isSearchBarFocused, setIsSearchBarFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header>
      <div className={styles.header_wrap}>
        <div className={styles.htd_logo_nav}>
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
              >
                ShopIt
              </NavLink>
            </li>
          </div>
          <div
            className={`${styles.hdt_nav} ${
              isSearchBarFocused ? styles.hdt_nav_search_focused : " "
            }`}
          >
            <div className={styles.menu_wrap}>
              <ul className={styles.hdt_menu}>
                <li>
                  <ExploreBox isOpen={isOpen} setIsOpen={setIsOpen} />
                </li>
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
                            new URLSearchParams(window.location.search).has(
                              "admin"
                            )
                              ? styles.nav_link_action
                              : isPending
                              ? styles.nav_link_pending
                              : styles.nav_link_default
                          }`
                        }
                      >
                        Open Store
                      </NavLink>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
        <div className={styles.hdt_option}>
          <div
            className={`${styles.htd_search_bar} ${
              isSearchBarFocused ? styles.htd_search_bar_focused : " "
            }`}
          >
            <HomeSearchBar onFocused={setIsSearchBarFocused} isFocused={isSearchBarFocused}/>
          </div>
          <div className={styles.hdt_buttons}>
            {isLogged && (
              <Link to={`/${!isLogged ? "login" : "home?profile_view=true"}`}>
                <FontAwesomeIcon
                  icon={faUser}
                  style={{
                    color: `${
                      new URLSearchParams(location.search).get(
                        "profile_view"
                      ) === "true"
                        ? "var(--bs-accent)"
                        : ""
                    }`,
                  }}
                />
                Profile
              </Link>
            )}
            <Link to={"/cart"}>
              <FontAwesomeIcon
                icon={faCartShopping}
                style={{
                  color: `${
                    location.pathname === "/cart" ? "var(--bs-accent)" : ""
                  }`,
                }}
              />
              Cart
            </Link>
            <div className={styles.hdt_theme_btn}>
              <ThemeToggleButton />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navber;
