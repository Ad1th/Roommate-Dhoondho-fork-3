import React from "react";
import "./Roompage.css";
import Navbar from "../NavBar/Navbar";
import NavTabs from "../TabBar/NavTabs";
import Footer from "../Footer/Footer";
import { useSelector } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";

const Roompage = () => {
  const user = useSelector((state) => state.authReducer.authData);
  // console.log("user", user);
  return (
    <>
      <NavTabs />
      <Footer />
    </>
  );
};

export default Roompage;
