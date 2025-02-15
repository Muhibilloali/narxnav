import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { CartContext } from "../../CartContext";
import { FavoriteContext } from "../../FavoriteContext";
import { useTranslation } from "react-i18next";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Navbar from "./Navbar";
import Footer from "../Footer";
import ip from "../Config"

function LeftFilter() {
  const { categoryName } = useParams();
  const [books, setBooks] = useState([]);
  const [openSnack, setOpenSnack] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");

  const { cart, addToCart, removeFromCart } = useContext(CartContext);
  const { favoriteBooks, addToFavorites, removeFromFavorites, isBookFavorite } =
    useContext(FavoriteContext);

  const { t, i18n } = useTranslation();

  useEffect(() => {
    fetch(`${ip}/api/products/?product_category=${categoryName}&ordering=product_price`)
      .then((response) => response.json())
      .then((data) => {
        const lang = localStorage.getItem("i18nextLng");

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

  const handleCartClick = (book) => {
    isBookInCart(book.id) ? removeFromCart(book) : addToCart(book);
    setSnackMessage(isBookInCart(book.id) ? t("savatchadan_ochirildi") : t("savatchaga_qoshildi"));
    setOpenSnack(true);
  };

  const handleFavoriteClick = (book) => {
    isBookFavorite(book.id) ? removeFromFavorites(book.id) : addToFavorites(book);
    setSnackMessage(isBookFavorite(book.id) ? t("sevimlilardan_ochirildi") : t("sevimlilarga_qoshildi"));
    setOpenSnack(true);
  };

  const isBookInCart = (bookId) => {
    return cart.some((book) => book.id === bookId);
  };

  const changeLanguage = (event) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-items-center mt-56">
        {books.length === 0 ? (
          <div className="flex justify-center item-center text-xl font-semibold text-center">
            {t("mavjud_emas")}
          </div>
        ) : (
          books.map((book) => (
            <Link
              to={`/productsabout/${book.id}`}
              key={book.id}
              className="flex flex-col justify-between"
            >
              <div className="flex flex-col justify-between border-2 shadow-2xl rounded-md drop-shadow-2xl w-64 h-full p-4">
                <img
                  src={book.product_cover}
                  alt={book.id}
                  className="w-full h-[200px] object-cover rounded-md mb-4"
                />
                <div className="flex flex-col justify-end flex-grow">
                  <div className="book-name text-md font-bold text-black ">
                    {book.book_name}
                  </div>
                  <div className=" text-slate-400 py-2">{book.book_author}</div>
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
          ))
        )}
      </div>
      <Footer />
    </div>
  );
}

export default LeftFilter;
