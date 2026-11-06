import React, { useState } from "react";

const Blog7Card = ({ img, headlines }) => {
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
      Pneumonia is a serious lung infection where air sacs fill with fluid or pus, leading to cough, fever, chills, and difficulty breathing. It can be caused by bacteria, viruses, or fungi and affects people of all ages, though infants, the elderly, and
       those with weakened immune systems are at higher risk. Prompt diagnosis and treatment with antibiotics or antivirals are crucial. 
        {isExpanded && (
          <>
           Learn about prevention, including vaccines, to reduce the risk of contracting this potentially life-threatening illness.
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

export default Blog7Card;
