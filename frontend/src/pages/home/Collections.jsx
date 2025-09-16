import React from "react";

const Collections = () => {
  const featuredCollections = [
    {
      name: "Morning Wear",
      img: "/featured1.png",
    },
    {
      name: "Noon Wear",
      img: "/featured2.png",
    },
    {
      name: "Party/Occasion Wear",
      img: "/featured3.png",
    },
  ];

  return (
    <div className="min-h-screen">
      <div>
        <h1 className="text-center font-bold p-12 lg:text-4xl">
          Featured Collections
        </h1>
      </div>

      {/* Horizontal scroll on small screens, grid on large screens with snapping */}
      <div className="flex overflow-x-auto lg:grid lg:grid-cols-3 gap-6 px-4 scrollbar-hide snap-x snap-mandatory">
        {featuredCollections.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center flex-shrink-0 cursor-pointer snap-start"
          >
            <img
              src={item.img}
              alt={item.name}
              className="rounded-lg w-40 h-40 object-cover sm:w-48 sm:h-48 lg:w-72 lg:h-80"
            />
            <p className="mt-3 text-sm sm:text-base lg:text-lg font-medium">
              {item.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Collections;

