// src/components/shared.js
import React from 'react';

export const Button = ({ children, ...rest }) => (
    <button
        type="button"
        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        {...rest}
    >
        {children}
    </button>
);

export const PageButton = ({ children, ...rest }) => (
    <button
        type="button"
        className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
        {...rest}
    >
        {children}
    </button>
);