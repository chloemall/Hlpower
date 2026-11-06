import React, { useState } from "react";

const Blog6Card = ({ img, headlines }) => {
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
      Asthma is a chronic lung condition characterized by airway inflammation and constriction, making breathing difficult. Common triggers
       include allergens, exercise, and stress. Symptoms such as wheezing, coughing, and shortness of breath can vary in severity. 
        {isExpanded && (
          <>
          While there's no cure, asthma can be effectively managed through medication, lifestyle changes, and avoiding triggers. Understanding
           asthma and its management can significantly improve quality of life and reduce the frequency and severity of asthma attacks.
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

export default Blog6Card;
