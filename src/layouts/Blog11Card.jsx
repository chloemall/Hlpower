import React, { useState } from "react";

const Blog11Card = ({ img, headlines }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="w-full lg:w-1/4 p-2 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] space-y-2 rounded-lg cursor-pointer hover:scale-105 transition duration-300 ease-in-out">
      <img
        className="h-64 md:h-96 lg:h-40 w-full rounded-lg"
        src={img}
        
        alt="img"
      />
      <h2 className="text-lg text-center font-semibold">{headlines}</h2>
      <p className="text-center text-sm">
      Vaccination is a critical step in preventing pneumonia, especially in high-risk groups such as young children, the elderly, and those with chronic health conditions.
       Vaccines like the pneumococcal vaccine protect against the most common bacteria that cause pneumonia.
        {isExpanded && (
          <>
            This guide explores the different types of pneumonia vaccines available, their benefits, and the recommended vaccination schedules. By getting vaccinated, you 
            significantly reduce the risk of severe illness, hospitalization, and complications associated with pneumonia.
          </>
        )}
        <button 
          onClick={toggleExpand} 
          className="text-blue-500 hover:underline mt-2"
        >
          {isExpanded ? "Read less" : "Read more"}
        </button>
      </p>
    </div>
  );
};

export default Blog11Card;
