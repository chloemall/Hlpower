import React, { useState } from "react";

const Blog9Card = ({ img, headlines }) => {
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
      Using an inhaler correctly is vital for managing conditions like asthma and chronic obstructive pulmonary disease (COPD).
       Proper technique ensures the medication reaches the lungs effectively, providing relief from symptoms.
        {isExpanded && (
          <>
           This guide walks you through the steps of using different types of inhalers, from shaking the device to breathing in the medication properly. By mastering these techniques,
            you can significantly improve your control over respiratory conditions, reducing the frequency and severity of symptoms.
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

export default Blog9Card;
