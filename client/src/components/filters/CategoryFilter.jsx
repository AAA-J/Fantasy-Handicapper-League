import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CategoryIcon, getCategoryConfig } from '../icons/SportIcons';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CategoryFilter = ({ 
  categories = [], 
  selectedCategory = 'all', 
  onCategoryChange, 
  showCounts = true,
  className = '' 
}) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollRef = React.useRef(null);

  const allCategories = [
    { id: 'all', name: 'All', count: categories.reduce((sum, cat) => sum + (cat.count || 0), 0) },
    ...categories
  ];

  useEffect(() => {
    const checkScrollButtons = () => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
      }
    };

    checkScrollButtons();
    window.addEventListener('resize', checkScrollButtons);
    return () => window.removeEventListener('resize', checkScrollButtons);
  }, [categories]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      const newPosition = direction === 'left' 
        ? scrollPosition - scrollAmount 
        : scrollPosition + scrollAmount;
      
      scrollRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
      setScrollPosition(newPosition);
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      setScrollPosition(scrollRef.current.scrollLeft);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Scroll Buttons */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft size={16} className="text-gray-600" />
        </button>
      )}
      
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors"
        >
          <ChevronRight size={16} className="text-gray-600" />
        </button>
      )}

      {/* Category Icons */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex space-x-1 overflow-x-auto scrollbar-hide pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {allCategories.map((category) => {
          const isSelected = selectedCategory === category.id;
          const config = getCategoryConfig(category.id);
          
          return (
            <motion.button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                flex flex-col items-center p-3 rounded-xl min-w-[80px] transition-all duration-200
                ${isSelected 
                  ? `${config.bgColor} ${config.color} shadow-md` 
                  : 'hover:bg-gray-100 text-gray-600'
                }
              `}
            >
              <CategoryIcon 
                category={category.id} 
                size={24} 
                className={isSelected ? 'mb-1' : 'mb-1'}
              />
              <span className={`text-xs font-medium ${isSelected ? 'font-semibold' : ''}`}>
                {category.name}
              </span>
              {showCounts && category.count !== undefined && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`
                    text-xs px-2 py-0.5 rounded-full mt-1
                    ${isSelected 
                      ? 'bg-white bg-opacity-50' 
                      : 'bg-gray-200 text-gray-600'
                    }
                  `}
                >
                  {category.count}
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilter;
