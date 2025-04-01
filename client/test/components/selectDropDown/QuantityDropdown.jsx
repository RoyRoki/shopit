import React, { useState } from "react";
import "./Dropdown.css"; // Add your styles in a separate CSS file

const QuantityDropdown = () => {
  const [quantity, setQuantity] = useState(1); // Selected quantity
  const [isOpen, setIsOpen] = useState(false); // Dropdown visibility

  const toggleDropdown = () => setIsOpen(!isOpen);

  const selectQuantity = (value) => {
    setQuantity(value);
    setIsOpen(false); // Close dropdown after selection
  };

  return (
    <div className="select_quantity_option" onClick={toggleDropdown}>
      <span>
        Quantity: <span id="selectedQuantity">{quantity}</span>
      </span>
      {isOpen && (
        <div className="dropdown">
          <ul className="a-nostyle a-list-link" role="listbox" aria-multiselectable="false">
            {[...Array(10)].map((_, index) => (
              <li
                key={index + 1}
                role="option"
                className="a-dropdown-item"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent click from toggling dropdown
                  selectQuantity(index + 1);
                }}
              >
                <a href="javascript:void(0)">{index + 1}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default QuantityDropdown;
