import React, { useState } from "react";

const BlogCard = ({ img, headlines, description }) => {
  const [showDescription, setShowDescription] = useState(false);

  return (
    <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <img src={img} alt="Blog" className="w-full h-48 object-cover" />
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-2">{headlines}</h2>
          {showDescription && (
            <p className="text-sm text-gray-600">{description}</p>
          )}
          <button
            className="text-blue-500 hover:text-blue-700 text-sm mt-2"
            onClick={() => setShowDescription(!showDescription)}
          >
            {showDescription ? "Show Less" : "Read More"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;