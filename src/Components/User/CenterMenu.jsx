import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import ip from "../Config";

function CenterMenu() {
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
        setVisibleCategories(4); // Phone
      } else if (window.innerWidth >= 640 && window.innerWidth < 1024) {
        setVisibleCategories(8); // Tablet
      }  else if (window.innerWidth >= 1024 && window.innerWidth < 1920) {
        setVisibleCategories(8); // Tablet
      } else {
        setVisibleCategories(8); // Desktop
      }
    };

    updateVisibleCategories();
    window.addEventListener("resize", updateVisibleCategories);
    return () => window.removeEventListener("resize", updateVisibleCategories);
  }, []);

  return (
    <div className="center-menu bg-gray-200 w-[90%] mx-auto p-4 rounded-md shadow-md overflow-hidden">
      <div className="flex justify-center flex-wrap gap-4">
        {categories.slice(0, visibleCategories).map((category, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center text-center border-none rounded-full w-32 h-32 p-4"
          >
            <Link to={`/leftfilter/${category.name}`} key={category.id}>
              <img
                className="rounded-full w-24 h-24 object-cover mx-auto"
                src={category.photo}
                alt={category.name}
              />
              <div className="mt-2 text-md font-bold">{category.name}</div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CenterMenu;
