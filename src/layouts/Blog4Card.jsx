import React, { useState } from "react";

const Blog4Card = ({ img, headlines }) => {
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
        Lung infection, commonly known as pneumonia, is an inflammation of the lungs 
        usually caused by bacterial, viral, or fungal infections. It leads to symptoms 
        like cough, fever, and difficulty breathing. 
        {isExpanded && (
          <>
            For comprehensive information on pneumonia, including its causes, symptoms, and treatment options, 
            <a 
              href="https://www.mayoclinic.org/diseases-conditions/pneumonia/symptoms-causes/syc-20354325" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-500 hover:underline"
            >
              visit the Mayo Clinic article on pneumonia.
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

export default Blog4Card;
