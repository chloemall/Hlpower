import React, { useState } from "react";

const Blog8Card = ({ img, headlines }) => {
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
      Bronchiolitis is a common respiratory infection in infants and young children, usually caused by the respiratory syncytial virus (RSV).
       It leads to inflammation and congestion in the small airways of the lungs, causing coughing, wheezing, and difficulty breathing.
        {isExpanded && (
          <>
           The condition is most prevalent during the winter months and can be particularly severe in premature infants or those with underlying
            health conditions. Learn about the symptoms, home care tips, and when to seek medical attention to ensure proper treatment.
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

export default Blog8Card;
