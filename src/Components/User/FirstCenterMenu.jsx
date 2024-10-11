import React, { useEffect, useState } from "react";

function FirstCenterMenu() {
  const [categories, setCategories] = useState([]);
  const [visibleCategories, setVisibleCategories] = useState(); // Default visible items for phone

  // Fetch JSON data on mount
  useEffect(() => {
    fetch("/FirstCenterMenu.json") // Adjusted path to fetch from the 'public' folder
      .then((response) => response.json())
      .then((data) => {
        const lang = localStorage.getItem("i18nextLng") || "en"; // Default to 'en' if language is not set
        setCategories(
          data.map((category) => ({
            ...category,
            name:
              lang === "uz"
                ? category.name_uz
                : lang === "ru"
                ? category.name_ru
                : category.name_en,
          }))
        );
      })
      .catch((error) => console.error("Error fetching data: ", error));
  }, []);

  // Adjust the visible categories based on screen size
  useEffect(() => {
    const updateVisibleCategories = () => {
      if (window.innerWidth < 640) {
        setVisibleCategories(3); // Phone
      } else if (window.innerWidth >= 640 && window.innerWidth < 1024) {
        setVisibleCategories(4); // Tablet
      } else if (window.innerWidth >= 1024 && window.innerWidth < 1540) {
        setVisibleCategories(9); // Laptop
      } else {
        setVisibleCategories(9); // Desktop
      }
    };

    updateVisibleCategories();
    window.addEventListener("resize", updateVisibleCategories);
    return () => window.removeEventListener("resize", updateVisibleCategories);
  }, []);

  return (
    <div className="first-center-menu mb-12 p-4 flex justify-center cursor-pointer overflow-hidden">
      {/* Grid system for the boxes, ensuring it's centered */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center w-full">
        {categories.slice(0, visibleCategories).map((category) => (
          <div
            key={category.id}
            className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-green-300 text-center border-none rounded-xl w-[400px] h-[150px] p-8"
          >
            <div className="mt-2 text-2xl text-white font-bold">{category.name}</div>
            <img
              className="w-32 h-32 object-cover mx-auto"
              src={category.photo} // Will work if 'photo' paths are correct in JSON
              alt={category.name}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default FirstCenterMenu;
