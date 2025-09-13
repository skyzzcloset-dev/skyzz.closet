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
    <div className="h-screen">
      <div>
        <h1 className="text-center font-bold p-12 lg:text-4xl">
          Featured Collections
        </h1>
      </div>

      <div className="flex flex-wrap justify-center items-center gap-10">
        {featuredCollections.map((item, index) => (
          <div key={index} className="flex flex-col items-center cursor-pointer">
            <img
              src={item.img}
              alt={item.name}
              className="rounded-lg w-94 h-100 object-cover"
            />
            <p className="mt-3 text-lg font-medium">{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Collections;
