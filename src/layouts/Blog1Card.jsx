import React, { useState } from "react";

const Blog1Card = ({ img, headlines }) => {
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
        "The Lung-Healthy Diet" emphasizes the importance of nutrition in maintaining optimal lung function. 
        A diet rich in fruits, vegetables, whole grains, and lean proteins supports lung health by reducing 
        inflammation and enhancing respiratory efficiency. Foods high in antioxidants, such as berries and 
        leafy greens, help combat oxidative stress.
        {isExpanded && (
          <>
            {" "} 
            While omega-3 fatty acids from fish can alleviate symptoms of asthma and chronic respiratory conditions. Adopting a lung-healthy diet not only supports overall 
            well-being but also aids in the prevention and management of respiratory diseases.
            <br />
            For more detailed information, 
            <a 
              href="https://www.lung.org/lung-health-diseases/healthy-lungs/lung-health-diet" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-500 hover:underline"
            >
              visit the American Lung Association article on lung-healthy diets.
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

export default Blog1Card;
