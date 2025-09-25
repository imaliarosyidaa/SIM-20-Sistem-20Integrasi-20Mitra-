import { useState, useRef, useEffect } from "react";

export default function ComboBox(data) {
  const [options] = useState(data);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(false);

  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    const filtered = options?.filter(opt =>
      opt.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredOptions(filtered);

    setError(value !== "" && !options.includes(value));
    setIsOpen(true);
  };

  const handleSelect = (option) => {
    setInputValue(option);
    setError(false);
    setIsOpen(false);
  };

  return (
    <div className="w-64" ref={wrapperRef}>
      <div className="relative">
        <input
          type="text"
          placeholder="Cari opsi..."
          value={inputValue}
          onChange={handleChange}
          onFocus={() => setIsOpen(true)}
          className={`w-full border rounded-lg px-3 py-2 focus:outline-none ${error
            ? "border-red-500 focus:ring-2 focus:ring-red-400"
            : "focus:ring-2 focus:ring-purple-500"
            }`}
        />
        <svg viewBox="0 0 20 20" fill="currentColor" data-slot="icon" aria-hidden="true" className="syw szy">
          <path d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" fill-rule="evenodd"></path>
        </svg>
      </div>

      {error && (
        <p className="text-red-500 text-sm mt-1">⚠ Pilih opsi yang tersedia</p>
      )}

      {isOpen && (
        <ul className="border rounded-lg mt-2 max-h-40 overflow-y-auto bg-white shadow">
          {filteredOptions?.length > 0 ? (
            filteredOptions.map((option, index) => (
              <li
                key={index}
                onClick={() => handleSelect(option)}
                className="px-3 py-2 hover:bg-purple-100 cursor-pointer"
              >
                {option}
              </li>
            ))
          ) : (
            <li className="px-3 py-2 text-gray-400">Tidak ada hasil</li>
          )}
        </ul>
      )}
    </div>
  );
}
