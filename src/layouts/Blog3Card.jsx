import React, { useState } from "react";

const Blog3Card = ({ img, headlines }) => {
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
        Collapse of part or all of the lung, known as pneumothorax or atelectasis,
        can be a serious condition requiring medical attention. Pneumothorax occurs
        when air leaks into the pleural space, causing the lung to collapse. Atelectasis
        involves the partial or complete collapse of a lung or lobe, often due to blockage
        or pressure. {isExpanded && (
          <>
            Both conditions can lead to difficulty breathing and other symptoms. For more detailed information, 
            <a 
              href="https://www.mayoclinic.org/diseases-conditions/pneumothorax/symptoms-causes/syc-20354043" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-500 hover:underline"
            >
              visit the Mayo Clinic article on pneumothorax and atelectasis.
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

export default Blog3Card;
