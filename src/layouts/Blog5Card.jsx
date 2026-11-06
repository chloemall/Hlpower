import React, { useState } from "react";

const Blog5Card = ({ img, headlines }) => {
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
        Abnormal buildup of fluid in the lungs, known as pulmonary edema, 
        can impair breathing and lead to severe respiratory distress. 
        This condition often results from heart problems but can also 
        be caused by other factors. 
        {isExpanded && (
          <>
            For detailed information on pulmonary edema, including its causes, symptoms, and treatments, visit the 
            <a 
              href="https://www.mayoclinic.org/diseases-conditions/pulmonary-edema/symptoms-causes/syc-20374777" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-500 hover:underline"
            >
              Mayo Clinic article on pulmonary edema.
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

export default Blog5Card;
