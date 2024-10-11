import React, { useEffect, useState } from 'react';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useNavigate } from 'react-router-dom';
import './SmsChat.css'; 
import './LeftMenu.css';
import ip from "../Components/Config"


function LeftMenu() {
  const [categories, setCategories] = useState([]);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [sidebarCenter, setSidebarCenter] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${ip}/api/categories/`)
      .then(response => response.json())
      .then((data) => {
        const lang = localStorage.getItem('i18nextLng');
        setCategories(data.map((category) => ({
          ...category,
          name_uz: category.name,
          name: lang === 'uz' ? category.name : lang === 'ru' ? category.name_ru : category.name_en,
        })));
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleCategoryClick = (categoryName) => {
    navigate(`/leftfilter/${categoryName}`);
  };

  return (
    <div className='relative flex h-full mt-4 mr-4'>
      <div className='LeftMenu overflow-hidden'>
        <ul className='absolute inset-0 overflow-y-auto cursor-pointer font-normal max-h-full scrollbar-thumb-gray-600 scrollbar-thumb-hover-gray-400'>
          {categories.map((category, index) => (
            <li
              key={index}
              className='left-menu capitalize border p-4 hover:bg-sky-200 flex justify-between text-xl'
              onMouseEnter={() => {
                setHoveredCategory(category);
                setSidebarCenter(true);
              }}
              onClick={() => handleCategoryClick(category.name_uz)}
            >
              {category.name} <ArrowForwardIosIcon />
            </li>
          ))}
        </ul>
      </div>

      {sidebarCenter && hoveredCategory && hoveredCategory.children && (
        <div className='absolute right-0 top-0 w-64 cursor-pointer bg-white text-black border-l'>
          <ul className='p-4'>
            {hoveredCategory.children.map((child, index) => (
              <li
                key={index}
                className='p-2 hover:bg-gray-200 cursor-pointer'
                onClick={() => handleCategoryClick(child.name_uz)}
              >
                {child.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default LeftMenu;


