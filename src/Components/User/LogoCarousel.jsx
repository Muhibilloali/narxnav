import React, { useState, useEffect } from "react";
import "tailwindcss/tailwind.css";
import { Link } from "react-router-dom";
import "../../index.css";
import ip from "../Config";

function LogoCarousel() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    // API'dan logotiplarni olish
    fetch(`${ip}/api/companies/`) // API URL'sini to'g'rilang
      .then((response) => response.json())
      .then((data) => {
        setBooks(data); // Logotiplarni state'ga saqlash
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="overflow-hidden w-full mt-8 relative">
      <div className="flex space-x-12 animate-scroll">
        {books.map((book, index) => (
          <div key={index} className="flex-shrink-0">
            <Link to={`/companyabout/${book.name}`}>
              <img
                className="rounded-full w-24 h-24"
                src={book.company_photo}
                alt={book.name}
              />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LogoCarousel;
