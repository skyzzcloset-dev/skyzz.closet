import React from "react";

const Pagination = ({ totalPosts, postsPerPage, currentPage, setCurrentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-center mt-8 gap-2">
      {pageNumbers.map((num) => (
        <button
          key={num}
          onClick={() => setCurrentPage(num)}
          className={`px-4 py-2 border rounded ${
            currentPage === num ? "bg-black text-white" : "bg-white text-black"
          }`}
        >
          {num}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
