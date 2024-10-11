import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import ip from "../Config";

function LeftMenuCenter() {
    const [categories, setCategories] = useState([]);
  const [visibleCategories, setVisibleCategories] = useState(4); // Default visible items for phone
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${ip}/api/categories/`)
      .then((response) => response.json())
      .then((data) => {
        const lang = localStorage.getItem("i18nextLng");
        setCategories(
          data.map((category) => ({
            ...category,
            name_uz: category.name,
            name:
              lang === "uz"
                ? category.name
                : lang === "ru"
                ? category.name_ru
                : category.name_en,
          }))
        );
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleCategoryClick = (categoryName) => {
    navigate(`/leftfilter/${categoryName}`);
  };

  // Adjust the visible categories based on screen size
  useEffect(() => {
    const updateVisibleCategories = () => {
      if (window.innerWidth < 640) {
        setVisibleCategories(3); // Phone
      } else if (window.innerWidth >= 640 && window.innerWidth < 1024) {
        setVisibleCategories(8); // Tablet
      }  else if (window.innerWidth >= 1024 && window.innerWidth < 1920) {
        setVisibleCategories(6); // Tablet
      } else {
        setVisibleCategories(6); // Desktop
      }
    };

    updateVisibleCategories();
    window.addEventListener("resize", updateVisibleCategories);
    return () => window.removeEventListener("resize", updateVisibleCategories);
  }, []);

  return (
    <div className="center-menu mb-12 p-4 flex justify-center cursor-pointer overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center w-full">
        {categories.slice(0, visibleCategories).map((category, index) => (
            <Link to={`/leftfilter/${category.name}`} key={category.id}>
          <div
            key={index}
            className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-green-300 text-center border-none rounded-xl w-[400px] h-[150px] p-8"
          >
              <div className="mt-2 text-2xl text-white font-bold">{category.name}</div>
              <img
                className="w-32 h-32 object-cover mx-auto"
                src={category.photo}
                alt={category.name}
              />
          </div>
            </Link>
        ))}
      </div>
    </div>
  );
}

export default LeftMenuCenter;
