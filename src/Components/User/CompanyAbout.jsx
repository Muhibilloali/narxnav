import React, { useEffect, useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { Box, Snackbar, Button } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { CartContext } from "../../CartContext";
import { FavoriteContext } from "../../FavoriteContext";
import { useTranslation } from "react-i18next";
import Footer from "../Footer";
import Navbar from "./Navbar";
import ip from "../Config";

function CompanyAbout() {
  const { categoryName } = useParams();
  const [openSnack, setOpenSnack] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [vertical, setVertical] = useState("top");
  const [horizontal, setHorizontal] = useState("right");
  const [books, setBooks] = useState([]);
  const [companyName, setCompanyName] = useState("");
  const [companyLogo, setCompanyLogo] = useState("");
  const [visibleBooksCount, setVisibleBooksCount] = useState(5); // State for pagination
  const { cart, addToCart, removeFromCart } = useContext(CartContext);
  const { favoriteBooks, addToFavorites, removeFromFavorites, isBookFavorite } =
    useContext(FavoriteContext);
  const { t, i18n } = useTranslation();

  const handleCloseSnack = () => {
    setOpenSnack(false);
  };

  const handleCartClick = (book) => {
    isBookInCart(book.id) ? removeFromCart(book) : addToCart(book);
    setSnackMessage(
      isBookInCart(book.id)
        ? t("savatchadan_ochirildi")
        : t("savatchaga_qoshildi")
    );
    setOpenSnack(true);
  };

  const handleFavoriteClick = (book) => {
    isBookFavorite(book.id)
      ? removeFromFavorites(book.id)
      : addToFavorites(book);
    setSnackMessage(
      isBookFavorite(book.id)
        ? t("sevimlilardan_ochirildi")
        : t("sevimlilarga_qoshildi")
    );
    setOpenSnack(true);
  };

  useEffect(() => {
    fetch(
      `${ip}/api/products/?product_company=${categoryName}&ordering=product_price`
    )
      .then((response) => response.json())
      .then((data) => {
        const lang = localStorage.getItem("i18nextLng");

        if (data.length > 0) {
          const firstBook = data[0];
          setCompanyName(
            lang === "uz"
              ? firstBook.product_company.name
              : lang === "ru"
              ? firstBook.product_company.name_ru
              : firstBook.product_company.name_en
          );
          setCompanyLogo(firstBook.product_company.logo);
        }

        setBooks(
          data.map((book) => ({
            ...book,
            book_name:
              lang === "uz"
                ? book.product_name
                : lang === "ru"
                ? book.product_name_ru
                : book.product_name_en,
            book_author:
              lang === "uz"
                ? book.product_company.name
                : lang === "ru"
                ? book.product_company.name_ru
                : book.product_company.name_en,
          }))
        );
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [categoryName]);

  const isBookInCart = (bookId) => {
    return cart.some((book) => book.id === bookId);
  };

  const handleLoadMore = () => {
    setVisibleBooksCount((prevCount) => prevCount + 5); // Load 5 more books
  };

  return (
    <div>
      <div className=" px-8 px-4 md:px-8 lg:px-4">
        <Navbar />

        <div className="title-name mt-36 flex flex-col w-full sm:w-56 text-4xl text-center">
          {/* Display the company name */}
          <div className="flex p-2">
            <p className="flex font-normal justify-center py-[5px] px-2 font-serif text-2xl	">
              {t("sotuvchi")}
            </p>
            <p className="flex font-serif ">{categoryName}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-items-center mt-12">
          {books.slice(0, visibleBooksCount).map((book, index) => (
            <Link
              to={`/productsabout/${book.id}`}
              key={index}
              className="flex flex-col justify-between"
            >
              <div className="flex flex-col justify-between border-2 shadow-2xl rounded-md drop-shadow-2xl w-64 h-full p-4">
                <img
                  src={book.product_cover}
                  alt={`kitob-${index + 1}`}
                  className="w-full h-[200px] object-cover rounded-md mb-4"
                />
                <div className="flex flex-col justify-end flex-grow">
                  <div className="book-name text-md font-bold text-black">
                    {book.book_name}
                  </div>
                  <div className="text-slate-400 py-2">{book.book_author}</div>
                  <div className="text-2xl text-green-600 py-2">
                    {book.product_price} UZS
                  </div>
                </div>
                <div className="flex justify-between">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleCartClick(book);
                    }}
                    className={`w-[90%] text-md rounded-md mt-4 p-2 ${
                      isBookInCart(book.id)
                        ? "bg-red-500 text-white"
                        : "bg-green-500 text-black"
                    }`}
                  >
                    {isBookInCart(book.id)
                      ? t("savatdan_ochirish")
                      : t("savatga_qoshish")}
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleFavoriteClick(book);
                    }}
                    className="mt-4 ml-2 text-2xl border-none rounded-full p-2 transition-all duration-300"
                  >
                    <FavoriteIcon
                      className={`transition-all duration-300 ${
                        isBookFavorite(book.id)
                          ? "text-rose-500"
                          : "text-slate-300"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {visibleBooksCount < books.length && (
          <div className="flex justify-center mt-8">
            <Button onClick={handleLoadMore}>{t("yana_korish")}</Button>
          </div>
        )}

        <Box sx={{ width: 100 }}>
          <Snackbar
            anchorOrigin={{ vertical, horizontal }}
            open={openSnack}
            onClose={handleCloseSnack}
            message={snackMessage}
            key={vertical + horizontal}
            autoHideDuration={1000} // Notification will be visible for 1 second
          />
        </Box>
      </div>
      <Footer />
    </div>
  );
}

export default CompanyAbout;
