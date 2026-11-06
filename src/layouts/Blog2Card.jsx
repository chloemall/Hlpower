import React, { useState } from "react";

const Blog2Card = ({ img, headlines }) => {
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
        Lung cancer can be caused by several factors, with smoking being the leading cause. Tobacco smoke contains
        carcinogens that damage lung cells, increasing cancer risk. Other causes include exposure to secondhand 
        smoke, environmental pollutants, radon gas, and certain occupational hazards like asbestos and diesel exhaust.
        {isExpanded && (
          <>
            Genetic factors can also play a role, with a family history of lung cancer increasing susceptibility. Additionally,
            chronic lung diseases such as chronic obstructive pulmonary disease (COPD) may elevate the risk. Preventive measures, 
            such as avoiding smoking and reducing exposure to harmful substances, are crucial for lowering the risk of lung cancer.
            <br />
            For more detailed information, 
            <a 
              href="https://www.cancer.org/cancer/lung-cancer.html" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-500 hover:underline"
            >
              visit the American Cancer Society article on lung cancer.
            </a>
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

export default Blog2Card;
