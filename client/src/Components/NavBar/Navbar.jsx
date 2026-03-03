// eslint-disable-next-line
import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { logout } from "../../actions/AuthActions";
import { useDispatch, useSelector } from "react-redux";
import { Alert } from "@mui/material";
import { toast } from "react-toastify";
import "./Navbar.css";
import secureLocalStorage from "react-secure-storage";

function Navbar() {
  // console.log("Hello", secureLocalStorage.getItem("profile"))
  const profileData = JSON.parse(secureLocalStorage.getItem("profile")) || {};
  // console.log(profileData);
  const isProfileSet = profileData && !!profileData.user?.firstname;
  const isAdmin = profileData?.user?.isAdmin;
  const [navbar, setHeader] = useState("navbar");
  const navigate = useNavigate();
  const [click, setClick] = useState(false);
  const [dropdown, setDropdown] = useState(false);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const onMouseEnter = () => {
    if (window.innerWidth < 960) {
      setDropdown(true);
    } else {
      setDropdown(true);
    }
  };

  const onMouseLeave = () => {
    if (window.innerWidth < 960) {
      setDropdown(false);
    } else {
      setDropdown(false);
    }
  };
  const dispatch = useDispatch();

  const handleLogOut = () => {
    secureLocalStorage.removeItem("profile");
    dispatch(logout());
    navigate("/");
  };

  function ProfileClickHandler() {
    navigate("/profile");
  }

  return (
    <>
      {!isProfileSet && (
        <Alert severity="warning" className="profile-message">
          <Link to="/profile">Profile not set. Please set your profile first from here. </Link>
        </Alert>
      )}
      <nav className="navbar">
        <a href="/home">
          <img src="./image/logo.png" alt="" style={{ height: "60px" }} />
        </a>
        <div className="menu-icon" onClick={handleClick}>
          <i className={click ? "fas fa-times" : "fas fa-bars"} />
        </div>
        <ul className={click ? "nav-menu active" : "nav-menu"}>
          <li className="nav-item header-btn my-roommates">
            <NavLink to="/home" className="nav-links" onClick={closeMobileMenu}>
              <button className="nav-btn orange-btn">
                <i className="fa-solid fa-user-group white-icon" />
                <span>My Roommates</span>
              </button>
            </NavLink>
          </li>
          <li
            className="nav-item header-btn add-listing"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >
            <NavLink to="/need" className="nav-links" onClick={closeMobileMenu}>
              <button className="nav-btn orange-btn">
                <i className="fa-solid fa-plus white-icon" />
                <span>Add Listing</span>
              </button>
            </NavLink>
          </li>
          <li className="nav-item header-btn bookmarks-icon">
            <Link
              to="/selections"
              className="nav-links icon-btn orange-btn"
              onClick={closeMobileMenu}
            >
              <i className="fa-regular fa-heart white-icon"></i>
            </Link>
          </li>
          <li className="nav-item header-btn user-icon">
            <Link
              to="/profile"
              className="nav-links icon-btn orange-btn"
              onClick={ProfileClickHandler}
            >
              <i className="fa-regular fa-user white-icon"></i>
            </Link>
          </li>
          <li className="nav-item header-btn logout-icon">
            <Link
              to="/"
              className="nav-links icon-btn orange-btn"
              onClick={handleLogOut}
            >
              <i className="fa-solid fa-arrow-right-from-bracket white-icon"></i>
            </Link>
          </li>
          <li className="nav-item-mobile">
            <Link
              to="/home"
              className="nav-links-mobile"
              onClick={closeMobileMenu}
            >
              My Roomies
            </Link>
          </li>
          <li className="nav-item-mobile">
            <Link
              to="/need"
              className="nav-links-mobile user"
              onClick={closeMobileMenu}
            >
              Add Listing
            </Link>
          </li>
          <li className="nav-item-mobile">
            {(
              <Link to="/chatMobile" className="nav-links-mobile user" onClick={closeMobileMenu}>
                Chat
              </Link>
            )}
          </li>
          <li className="nav-item-mobile">
            <Link
              to="/selections"
              className="nav-links-mobile bookmarks"
              onClick={closeMobileMenu}
            >
              Selections
            </Link>
          </li>
          <li className="nav-item-mobile" onClick={ProfileClickHandler}>
            <Link
              to="/profile"
              className="nav-links-mobile user"
              onClick={closeMobileMenu}
            >
              Profile
            </Link>
          </li>
          <li className="nav-item-mobile">
            <Link
              to="/"
              className="nav-links-mobile user"
              onClick={handleLogOut}
            >
              Logout
            </Link>
          </li>
        </ul>
      </nav>
      <hr className="hr1" />
    </>
  );
}
export default Navbar;
