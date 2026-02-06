import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FiChevronDown, FiChevronUp, FiCheck } from 'react-icons/fi';
import './CustomSelect.css';

/**
 * Custom Select Component
 * Replaces native <select> with a styled dropdown using Portals to avoid clipping
 */
const CustomSelect = ({ 
  value, 
  onChange, 
  options = [], 
  placeholder = 'Select...',
  getOptionClass = () => '',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef(null);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (triggerRef.current && !triggerRef.current.contains(event.target)) {
        // Check if click is inside the portal dropdown
        const dropdown = document.getElementById('custom-select-dropdown');
        if (dropdown && dropdown.contains(event.target)) {
          return;
        }
        setIsOpen(false);
      }
    };

    const handleScroll = () => {
      if(isOpen) setIsOpen(false); // Close on scroll to avoid detached dropdown
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleScroll);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isOpen]);

  const updateCoords = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  };

  const toggleOpen = () => {
    if (!isOpen) {
      updateCoords();
    }
    setIsOpen(!isOpen);
  };

  const handleSelect = (optionValue) => {
    onChange({ target: { value: optionValue } });
    setIsOpen(false);
  };

  // Format options
  const formattedOptions = options.map(opt => {
    // If opt is a string or number, handle normally
    if (typeof opt !== 'object' || opt === null) {
      return { label: opt, value: opt };
    }
    // If it's already an object {label, value}
    return opt;
  });

  const selectedOption = formattedOptions.find(opt => opt.value === value);

  return (
    <>
      <div className={`custom-select-container ${className}`}>
        <button 
          ref={triggerRef}
          type="button"
          className={`custom-select-trigger ${isOpen ? 'open' : ''} ${getOptionClass(value)}`}
          onClick={toggleOpen}
        >
          <span className="selected-text">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <span className="arrow-icon">
            {isOpen ? <FiChevronUp /> : <FiChevronDown />}
          </span>
        </button>
      </div>

      {isOpen && createPortal(
        <div 
          id="custom-select-dropdown"
          className="custom-select-portal"
          style={{
            position: 'absolute',
            top: coords.top,
            left: coords.left,
            width: coords.width,
            zIndex: 9999
          }}
        >
          <div className="custom-select-options open">
            <ul role="listbox">
              {formattedOptions.map((option) => (
                <li 
                  key={option.value}
                  role="option"
                  aria-selected={value === option.value}
                  className={`custom-select-option ${value === option.value ? 'selected' : ''} ${getOptionClass(option.value)}`}
                  onClick={() => handleSelect(option.value)}
                >
                  <span className="option-label">{option.label}</span>
                  {value === option.value && <FiCheck className="check-icon" />}
                </li>
              ))}
            </ul>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default CustomSelect;
