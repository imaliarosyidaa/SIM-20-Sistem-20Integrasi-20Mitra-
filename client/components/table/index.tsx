// Jangan import ini, karena sudah ada di react-table
// const useAsyncDebounce = (callback, wait) => {
//     const [debounced, setDebounced] = useState(callback);
//     useEffect(() => {
//         const timeout = setTimeout(() => setDebounced(callback), wait);
//         return () => clearTimeout(timeout);
//     }, [callback, wait]);
//     return debounced;
// };

import { useTable, useGlobalFilter, useSortBy, usePagination } from 'react-table';
import { ChevronDoubleLeftIcon, ChevronLeftIcon, ChevronRightIcon, ChevronDoubleRightIcon } from '@heroicons/react/solid';
import { Button, PageButton } from '../shared';
import React, { useState, useEffect } from 'react';
// Import useAsyncDebounce dari react-table
import { useAsyncDebounce } from 'react-table';

// Perbaikan pada GlobalFilter
function GlobalFilter({
    preGlobalFilteredRows,
    globalFilter,
    setGlobalFilter,
}) {
    const count = preGlobalFilteredRows.length;
    const [value, setValue] = useState(globalFilter);

    // useAsyncDebounce yang benar: Panggil setGlobalFilter di dalam debouncer
    const onChange = useAsyncDebounce(value => {
        setGlobalFilter(value || undefined);
    }, 200);

    // Gunakan useEffect untuk memanggil debouncer saat value berubah
    useEffect(() => {
        onChange(value);
    }, [value, onChange]);

    return (
        <div className="flex items-center gap-x-2">
            <label className="text-sm font-medium text-gray-700">Cari:</label>
            <input
                type="text"
                value={value || ""}
                onChange={e => {
                    setValue(e.target.value);
                }}
                placeholder={`${count} data...`}
                className="w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
            />
        </div>
    );
}

// Perbaikan pada komponen Table
export default function Table({ columns, data }) {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        state,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        preGlobalFilteredRows,
        setGlobalFilter,
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0 },
        },
        useGlobalFilter,
        useSortBy,
        usePagination
    );

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <GlobalFilter
                    preGlobalFilteredRows={preGlobalFilteredRows}
                    globalFilter={state.globalFilter}
                    setGlobalFilter={setGlobalFilter}
                />
            </div>

            <div className="mt-2 flex flex-col">
                <div className="-my-2 overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8">
                    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                            <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
                // Perbaikan pada header table
                                <thead className="bg-gray-50">
                                    {headerGroups.map(headerGroup => (
                                        // Pisahkan 'key' dari spread operator
                                        <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                                            {headerGroup.headers.map(column => (
                                                // Pisahkan 'key' dari spread operator
                                                <th
                                                    key={column.id}
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    {...column.getHeaderProps(column.getSortByToggleProps())}
                                                >
                                                    {column.render('Header')}
                                                </th>
                                            ))}
                                        </tr>
                                    ))}
                                </thead>

// Perbaikan pada body table
                                <tbody
                                    {...getTableBodyProps()}
                                    className="bg-white divide-y divide-gray-200"
                                >
                                    {page.map((row) => {
                                        prepareRow(row);
                                        return (
                                            // Pisahkan 'key' dari spread operator
                                            <tr key={row.id} {...row.getRowProps()}>
                                                {row.cells.map(cell => {
                                                    return (
                                                        // Pisahkan 'key' dari spread operator
                                                        <td
                                                            key={cell.id}
                                                            {...cell.getCellProps()}
                                                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                                        >
                                                            {cell.render('Cell')}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pagination */}
            {/* ... (kode pagination tidak diubah karena sudah benar) */}
        </>
    );
}