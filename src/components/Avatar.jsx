import React from "react";
const colors = [
  "bg-teal-200",
  "bg-lime-200",
  "bg-blue-200",
  "bg-pink-200",
  "bg-yellow-200",
  "bg-cyan-200",
  "bg-orange-200",
  "bg-red-200",
  "bg-brown-200",
  "bg-purple-200",
];

const Avatar = ({ initial, online }) => {
  const rand =
    initial?.charCodeAt(0) % colors.length ||
    Math.floor(Math.random() * colors.length || 3);

  const bgcolor = colors[rand];

  return (
    <div
      className={
        "w-12 h-12 bg-gray-300 rounded-full font-xl flex items-center justify-center relative " +
        bgcolor
      }
    >
      <div className="opacity-50 font-extrabold text-2xl capitalize">
        {initial}
      </div>
      {
        <div
          className={`absolute w-3 h-3 rounded-full bottom-0 right-0 border border-white shadow-md shadow-gray-50  ${
            online ? " bg-green-600" : " bg-gray-600"
          }`}
        ></div>
      }
    </div>
  );
};

export default Avatar;
