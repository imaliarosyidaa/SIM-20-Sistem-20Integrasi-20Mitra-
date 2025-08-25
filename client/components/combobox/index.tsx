import React, { useState } from "react";
import { Input } from "../ui/input";

type ComboBoxProps<T> = {
  data: T[];
  labelKey: keyof T;
  valueKey: keyof T;
  placeholder?: string;
  onChange?: (value: T) => void;
};

export default function ComboBox<T extends object>({
  data,
  labelKey,
  valueKey,
  placeholder = "Select...",
  onChange,
}: ComboBoxProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<T | null>(null);

  const filtered = data.filter((item) =>
    String(item[labelKey]).toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (item: T) => {
    setSelected(item);
    setQuery(String(item[labelKey]));
    setIsOpen(false);
    if (onChange) onChange(item);
  };

  return (
    <div className="relative">
      <Input
        type="text"
        className="py-2.5 sm:py-3 ps-4 pe-9 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-200"
        role="combobox"
        aria-expanded={isOpen}
        value={query}
        placeholder={placeholder}
        onChange={(e) => {
          const val = e.target.value;
          setQuery(val);
          setIsOpen(true);

          if (val === "") {
            setSelected(null);
          }
        }}
        onClick={() => setIsOpen(!isOpen)}
      />
      {selected && (
        <div
          className="absolute top-1/2 right-9 -translate-y-1/2 cursor-pointer"
          onClick={() => {
            setSelected(null);
            setQuery("");
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586
           l4.293-4.293a1 1 0 111.414 1.414L11.414 10
           l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414
           l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10
           4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}


      {isOpen && (
        <div
          className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-md dark:bg-neutral-900 dark:border-neutral-700"
          role="listbox"
        >
          {filtered.length > 0 ? (
            filtered.map((item, idx) => (
              <div
                key={idx}
                role="option"
                tabIndex={0}
                className="cursor-pointer py-2 px-4 text-sm text-gray-800 hover:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
                onClick={() => handleSelect(item)}
              >
                {String(item[labelKey])}
              </div>
            ))
          ) : (
            <div className="py-2 px-4 text-sm text-gray-500 dark:text-neutral-400">
              No results
            </div>
          )}
        </div>
      )}
    </div>
  );
}
