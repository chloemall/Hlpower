import React, { useState } from "react";

const LungCard = ({ icon, title }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="group flex flex-col items-center text-center gap-2 w-full lg:w-1/3 p-5 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] rounded-lg cursor-pointer lg:hover:-translate-y-6 transition duration-300 ease-in-out">
      <div className="bg-[#d5f2ec] p-3 rounded-full transition-colors duration-300 ease-in-out group-hover:bg-[#ade9dc]">
        {icon}
      </div>
      <h1 className="font-semibold text-lg">{title}</h1>
      <p>
      NCLHC offers specialized lung health services for children, 
      focusing on the diagnosis and treatment of conditions like asthma, bronchitis, 
      and other lung diseases. Our expert team uses advanced techniques to assess and manage respiratory health.


   </p>
      {isExpanded && (
        <p className="mt-2">
         We provide personalized care plans and ongoing monitoring to ensure optimal lung function and 
         overall well-being.
        </p>
      )}
      <h3
        className="text-backgroundColor cursor-pointer hover:text-[#ade9dc] transition duration-300 ease-in-out"
        onClick={toggleExpand}
      >
        {isExpanded ? "Show less" : "Learn more"}
      </h3>
    </div>
  );
};

export default LungCard;
