import React, { useState } from "react";

const Blog10Card = ({ img, headlines }) => {
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
      Cold and flu are common respiratory illnesses caused by different viruses. While they share similar symptoms like coughing, sneezing, and sore throat,
       flu tends to be more severe with added symptoms like high fever, body aches, and fatigue. 
        {isExpanded && (
          <>
           Understanding the differences helps in managing symptoms and knowing when to seek medical attention. Prevention is key—practice good hygiene,
            stay hydrated, and consider annual flu vaccination to protect yourself and others during the peak flu season.
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

export default Blog10Card;
