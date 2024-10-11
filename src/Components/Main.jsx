import React, { useState, useContext, useEffect, useRef } from "react";
import SwipeCarousel from "./SwipeCarousel";
import Navbar from "./User/Navbar";
import Texnikalar from "./User/Texnikalar";
import CenterMenu from "./User/CenterMenu";
import FirstCenterMenu from "./User/FirstCenterMenu";
import Footer from "./Footer";
import LeftMenu from "./LeftMenu2";
import LeftMenuCenter from "./User/LeftMenuCenter";
import SmsChat from "./SmsChat";
import Companies from "../Components/User/Companies";
import "./SmsChat.css";
import "tailwindcss/tailwind.css";
import { useTranslation } from "react-i18next";
import { CartContext } from "../CartContext";
import "../index.css";
import Chegirmalar from "./User/Chegirmalar";
import Bolalar from "./User/Bolalar";
import ip from "../Components/Config";
import LogoCarousel from "./User/LogoCarousel";

const Main = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [leftMenuOpen, setLeftMenuOpen] = useState(false);
  const [books, setBooks] = useState([]);
  const [visibleBooksCount, setVisibleBooksCount] = useState(5); // State for pagination
  const { cart, favoriteBooks } = useContext(CartContext);
  const cartItemsCount = cart.length;
  const favoriteItemsCount = favoriteBooks.length;

  const handleSearchIconClick = () => {
    setSearchOpen(!searchOpen);
  };

  const handleMenuIconClick = () => {
    setMenuOpen(!menuOpen);
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  const handleClickOutside = (e) => {
    if (e.target.closest(".search-container") === null) {
      setSearchOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOpen = () => setOpenKirish(true);
  const handleClose = () => {
    setOpenKirish(false);
    setOpen(false);
  };

  const handleLeftMenuToggle = () => {
    setLeftMenuOpen(!leftMenuOpen);
  };

  const { t, i18n } = useTranslation();
  const changeLanguage = (event) => {
    i18n.changeLanguage(event.target.value);
  };

  const carouselRef = useRef(null);

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  useEffect(() => {
    fetch(`${ip}/api/companies/`)
      .then((response) => response.json())
      .then((data) => {
        const lang = localStorage.getItem("i18nextLng");

        setBooks(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div>
      <div className="min-h-[55vh] mx-auto px-4">
        <Navbar  cartItems={cartItemsCount} favoriteItems={favoriteItemsCount} />
        <div className="mt-32 ">
          <Companies />
          {/* Main Layout Container */}
          <div className="flex max-h-[85vh]">
            {/* Left Menu */}
            <div
              className={`w-1/4 ${leftMenuOpen ? "block" : "hidden"} md:block transition-all duration-300 ease-in-out overflow-hidden`}
            >
              <LeftMenu />
            </div>
            {/* Advertisement/Carousel Section */}
            <div className="w-3/4 flex-grow overflow-hidden">
              <SwipeCarousel />
            </div>
          </div>
          <SmsChat />
        </div>
        {/* <LogoCarousel /> */}
        <Chegirmalar />
        <FirstCenterMenu />
        <Texnikalar />
        {/* <CenterMenu /> */}
        {/* <LeftMenuCenter />
        <Bolalar /> */}
      </div>
      <Footer />
    </div>
  );
};

export default Main;
