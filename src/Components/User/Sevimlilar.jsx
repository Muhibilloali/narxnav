import { Container } from "@mui/system";
import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "../../CartContext";
import Navbar from "./Navbar";
import Footer from "../Footer";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";

function Sevimlilar() {
  const { cart, addToCart, removeFromCart, favoriteBooks, removeFromFavorites } = useContext(CartContext);
  const [localFavorites, setLocalFavorites] = useState(favoriteBooks);

  useEffect(() => {
    setLocalFavorites(favoriteBooks);
  }, [favoriteBooks]);

  const favoriteItemsCount = localFavorites.length;

  const isBookInCart = (bookId) => {
    return cart.some(book => book.id === bookId);
  };

  const handleFavoriteClick = (bookId) => {
    removeFromFavorites(bookId);
  };

  const { t, i18n } = useTranslation();

  const changeLanguage = (event) => {
    i18n.changeLanguage(event.target.value);
  };

  const isBookFavorite = (bookId) => {
    return localFavorites.some((book) => book.id === bookId);
  };

  return (
    <div>
      <Container className="min-h-[55vh] w-80 flex flex-col justify-between">
        <Navbar favoriteItems={favoriteItemsCount} />
        <div className="mt-56 flex-grow">
          <div className="flex flex-wrap justify-center mt-12 gap-4">
            {localFavorites.length === 0 ? (
              <div className="text-center text-4xl">{t("sevimli_bosh")} 😢</div>
            ) : (
              localFavorites.map((book) => (
                <Link
                  to={`/productsabout/${book.id}`}
                  key={book.id} // Unique key based on book.id
                  className="flex flex-col justify-between w-80"
                >
                  <div className="flex flex-col justify-between border-2 shadow-2xl rounded-md drop-shadow-2xl w-full h-full m-4 p-4">
                    <img
                      src={book.product_cover}
                      alt={`kitob-${book.id}`}
                      className="w-full h-[350px] object-cover rounded-md mb-4"
                    />
                    <div className="book-name text-lg text-black">{book.product_name}</div>
                    <div className="text-slate-400">{book.product_company.name}</div>
                    <div className="text-2xl  text-green-600">{book.product_price} UZS</div>
                    <div className="flex justify-between">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          isBookInCart(book.id) ? removeFromCart(book) : addToCart(book);
                        }}
                        className={`w-[90%] text-md rounded-md mt-4 p-2 ${
                          isBookInCart(book.id) ? 'bg-red-500 text-white' : 'bg-green-500 text-black'
                        }`}
                      >
                        {isBookInCart(book.id) ? "O'chirish" : "Savatga qo'shish"}
                      </button>
                      <button
                            onClick={(e) => {
                              e.preventDefault();
                              handleFavoriteClick(book);
                            }}
                            className={`mt-2 ml-4 mr-4 text-4xl ${
                              isBookFavorite(book.id)
                                ? "text-rose-500"
                                : "text-slate-300"
                            }`}
                          >
                            <FavoriteIcon />
                          </button>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </Container>
      <Footer />
    </div>
  );
}

export default Sevimlilar;
