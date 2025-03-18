import React, { useState, useEffect } from "react";
import axios from "axios";

const SearchSuggestions = ({ query, type, onSelect }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (query.length > 0) {
      axios
        .get(`http://localhost:5000/api/job/suggestions?query=${query}&type=${type}`)
        .then((response) => {
          setSuggestions(response.data);
          setShowSuggestions(response.data.length > 0); // Show only if suggestions exist
        })
        .catch((error) => console.error("Error fetching suggestions", error));
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query, type]);

  const handleSelect = (item) => {
    onSelect(item);
    setTimeout(() => {
      setSuggestions([]); // Clear the suggestions list
      setShowSuggestions(false); // Hide the dropdown
    }, 100); // Small delay for a smooth user experience
  };

  return (
    showSuggestions && (
      <div className="absolute z-10 bg-white shadow-md border rounded-md w-full">
        {suggestions.map((item, index) => (
          <div
            key={index}
            className="p-2 hover:bg-gray-200 cursor-pointer"
            onClick={() => handleSelect(item)}
          >
            {item}
          </div>
        ))}
      </div>
    )
  );
};

export default SearchSuggestions;
