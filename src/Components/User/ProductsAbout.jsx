import React, { useEffect, useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import { CartContext } from "../../CartContext";
import Rating from "@mui/material/Rating";
import Box from "@mui/material/Box";
import StarIcon from "@mui/icons-material/Star";
import Footer from "../Footer";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useTranslation } from "react-i18next";
import PriceChangeGraph from "./PriceChangeGraph";
import ip from "../Config";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const labels = {
  0.5: "",
  1: "",
  1.5: "",
  2: "",
  2.5: "",
  3: "",
  3.5: "",
  4: "",
  4.5: "",
  5: "",
};

function getLabelText(value) {
  return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
}

function HoverRating({ value }) {
  const [hover, setHover] = useState(-1);

  return (
    <Box sx={{ width: 200, display: "flex", alignItems: "center" }}>
      <Rating
        name="hover-feedback"
        value={value}
        precision={0.5}
        getLabelText={getLabelText}
        readOnly
        onChangeActive={(event, newHover) => setHover(newHover)}
        emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
      />
      {value !== null && (
        <Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : value]}</Box>
      )}
    </Box>
  );
}

const variants = {
  initial: { scaleY: 0.5, opacity: 0 },
  animate: {
    scaleY: 1,
    opacity: 1,
    transition: {
      repeat: Infinity,
      repeatType: "mirror",
      duration: 1,
      ease: "circIn",
    },
  },
};

const BarLoader = () => (
  <motion.div
    transition={{ staggerChildren: 0.25 }}
    initial="initial"
    animate="animate"
    className="flex gap-1"
  >
    <motion.div variants={variants} className="h-12 w-2 bg-white" />
    <motion.div variants={variants} className="h-12 w-2 bg-white" />
    <motion.div variants={variants} className="h-12 w-2 bg-white" />
    <motion.div variants={variants} className="h-12 w-2 bg-white" />
    <motion.div variants={variants} className="h-12 w-2 bg-white" />
  </motion.div>
);

function ProductsAbout() {
  const { t, i18n } = useTranslation();
  const [book, setBook] = useState(null);
  const [products, setProduct] = useState([]);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const { cart, addToCart, removeFromCart } = useContext(CartContext);
  const [openSnack, setOpenSnack] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");

  const handleCloseSnack = () => setOpenSnack(false);

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
    fetch(`${ip}/api/products/${id}`)
      .then((response) => response.json())
      .then((data) => {
        const lang = localStorage.getItem("i18nextLng");
        if (data) {
          const bookData = {
            ...data,
            book_name:
              lang === "uz"
                ? data.product_name
                : lang === "ru"
                ? data.product_name_ru
                : data.product_name_en,
            book_author:
              lang === "uz"
                ? data.product_company?.name
                : lang === "ru"
                ? data.product_company?.name_ru
                : data.product_company?.name_en,
          };

          fetch(
            `${ip}/api/products/?product_category=${data.product_category.name}`
          )
            .then((response) => response.json())
            .then((product) => setProduct(product));

          setBook(bookData);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching book:", error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="grid place-content-center justify-center bg-violet-600 px-4 py-24">
        <BarLoader />
      </div>
    );
  }

  const isBookInCart = (bookId) => cart.some((book) => book.id === bookId);

  if (!book) {
    return <div>{t("Mahsulot topilmadi")}</div>;
  }

  return (
    <div>
      <div className="mx-4 md:mx-12 lg:mx-32 mt-4">
        <Navbar />
        <div className="flex flex-col  items-center w-full mt-36 gap-4">
          <div className="flex flex-col xl:flex-row  border-4 shadow-2xl rounded-md drop-shadow-2xl w-auto h-full py-8 px-10 m-4 gap-6">
            <img
              src={book.product_cover}
              className="kichkina-rasm w-[150px] md:max-w-56 h-[100px] object-cover rounded-md mb-4 md:mb-0 hidden sm:block"
            />
            <img
              src={book.product_cover}
              className="w-full md:max-w-96 h-[400px] object-cover rounded-md mb-4 md:mb-0"
            />
            <div className="flex flex-col justify-between  w-full">
              <div>
                <div className="book-name text-xl md:text-2xl mb-2 text-black">
                  {book.book_name}
                </div>
                <div className="text-sky-400 text-sm mb-2 md:text-base">
                  {book.book_author}
                </div>
                <HoverRating value={book.product_rating} />
                <div className="flex text-center justify-between">
                  <p className="text-2xl text-center font-bold mb-4 mt-[10px] text-green-600">
                    {book.product_price}UZS
                  </p>
                </div>
                <div className="book-name flex items-end text-sm mb-2 md:text-base mt-4 text-zinc-500">
                  <p>{t("sotuvda-mavjud")}:</p> <div />{" "}
                  <p className="ml-2 font-black">{book.product_count}</p>
                </div>
                <div className="book-name flex items-end text-sm md:text-base my-4 text-zinc-500">
                  <p>{t("sotuvchi")}</p>
                  <div className="flex ml-2" />{" "}
                  <p className="font-black capitalize">
                    {book.product_company?.name}
                  </p>
                </div>
                <div className="hidden xl:block transition-all duration-300 ease-in-out overflow-hidden">
                  <PriceChangeGraph />
                </div>
              </div>
              <div className="flex justify-between flex-wrap ">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleCartClick(book);
                  }}
                  className={`text-md rounded-md mt-4 p-2 ${
                    isBookInCart(book.id)
                      ? "bg-red-500 text-white"
                      : "bg-blue-500 text-black"
                  }`}
                >
                  <ShoppingCartIcon className="md:mr-2 hidden md:inline" />
                  {isBookInCart(book.id)
                    ? t("savatdan_ochirish")
                    : t("savatga_qoshish")}
                </button>

                <Link to={`${book.product_company?.email}`} target="_black">
                  <button
                    className="w-full text-md text-green-500 border-2 border-green-500 
                    hover:text-black hover:bg-green-500 rounded-md mt-4 p-2"
                  >
                    {t("locatsiya")}
                  </button>
                </Link>

                <Link to="/xarid" state={{ cart }}>
                  <button
                    className="w-auto text-md text-green-500 border-2 border-green-500  
                    hover:text-black hover:bg-green-500 rounded-md mt-4 p-2 md:mt-4"
                  >
                    {t("tezkor_olish")}
                  </button>
                </Link>
              </div>
            </div>
          </div>

          <div className="flex-col w-[83%]">
            <div className="flex justify-start">
              <button className="bg-blue-700 hover:bg-blue-800 w-auto text-md text-white rounded-md mt-4 mb-2 p-2">
                {t("malumotlar")}
              </button>
              <button
                className="text-md bg-blue-700 text-white border-none border-blue-500 
                hover:bg-blue-800 rounded-md mt-4 ml-4 mb-2 p-2"
              >
                {t("izohlar")}
              </button>
            </div>

            <div className="book-desc border-none rounded-md w-[100%] h-auto mt-2 mb-16 p-4 bg-neutral-200">
              <p>{book.product_description}</p>
            </div>

            {/* Ayni maxsulotni boshqa sotuvchilardagi narxlari */}

            <div className="title flex flex-col font-bold text-2xl pb-4 w-full ">
              {t("boshqa_narxlar")}{" "}
            </div>
            {products.map((product, index) => (
              <Link
              to={`/productsabout/${product.id}`}
              onClick={() =>
                window.location.replace(`/productsabout/${product.id}`)
              }
              className="hover:underline"
            >
              <div
                key={index}
                className="book-desc flex flex-col md:flex-row border rounded-md w-full h-auto mt-2 mb-16 p-4 bg-white shadow-md gap-4"
              >
                <img
                  src={book.product_cover}
                  className="qo'shimcha-rasm w-[150px] md:max-w-56 h-[100px] object-cover rounded-md mb-4 md:mb-0 mx-auto sm:mx-auto"
                />
                <div className="flex flex-col items-center justify-center w-full md:w-1/5 text-center">
                  <p className="font-bold">{t("eng-arzoni")}</p>
                  <h4 className="text-xl font-bold">
                    {product.product_price} UZS
                  </h4>
                  <p className="text-green-500 font-bold">
                    {product.product_company?.name}
                  </p>
                </div>

                <div className="flex flex-col items-center justify-center w-full md:w-1/5 text-center">
                  
                    <h1 className="text-2xl  text-green-500 font-semibold">
                      {product.product_name}
                    </h1>
                 
                </div>

                <div className="flex items-center justify-center w-full md:w-1/5 text-center">
                  <p className="mr-2">{t("sotuvda-mavjud")}:</p>
                  <p>{product.product_count}</p>
                </div>

                <div className="flex items-center justify-center w-full md:w-1/5 text-center">
                  <p>{t("kargo-bepul")}</p>
                </div>

                <div className="flex flex-col items-center justify-center w-full md:w-1/5 text-center">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleCartClick(product);
                    }}
                    className={`w-full xl:w-48 text-md rounded-md p-2 my-2 ${
                      isBookInCart(product.id)
                        ? "bg-red-500 text-white"
                        : "bg-green-500 text-black"
                    }`}
                  >
                    <ShoppingCartIcon className="md:mr-2 hidden md:inline" />
                    {isBookInCart(product.id)
                      ? t("savatdan_ochirish")
                      : t("savatga_qoshish")}
                  </button>

                  <Link to={`${book.product_company?.email}`} target="_black">
                    <button className="w-full bg-green-500 hover:bg-green-700 text-md rounded-md p-2">
                      <LocationOnIcon className="md:mr-2" />
                      {t("sotuvchining-manzili")}
                    </button>
                  </Link>
                </div>
              </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ProductsAbout;
